import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
  fetchGraduationDocumentsApi,
  updateGraduationDocumentApi,
  createGraduationDocumentApi,
  generateGraduationDocumentStreamApi
} from '@/api/graduation.api';
import { GRAD_DOC_GENERATION_ORDER } from '@/utils/graduation-document-generation';
import type { GraduationDocType, GraduationDocument } from '@/types/graduation-document';

export const useGraduationDocumentStore = defineStore('graduationDocument', () => {
  const documents = ref<GraduationDocument[]>([]);
  const currentProjectId = ref<number | null>(null);
  const loading = ref(false);
  const generating = ref(false);
  const generatingDocType = ref<GraduationDocType | null>(null);
  const generationContent = ref<string>('');
  const generationStats = ref<{
    tokenCount: number;
    tokensPerSecond: number;
    elapsedSeconds: number;
  }>({
    tokenCount: 0,
    tokensPerSecond: 0,
    elapsedSeconds: 0
  });
  const saving = ref(false);
  const error = ref<string | null>(null);

  let generationAbortController: AbortController | null = null;

  const allDocsGenerated = computed(() => {
    return GRAD_DOC_GENERATION_ORDER.every(docType => {
      const document = documents.value.find(d => d.docType === docType);
      return document && document.content.length > 0;
    });
  });

  async function fetchDocuments(projectId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    currentProjectId.value = projectId;
    generating.value = false;
    generatingDocType.value = null;

    try {
      const response = await fetchGraduationDocumentsApi(projectId);
      documents.value = response.documents;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取毕设文档失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function updateDocument(id: number, content: string): Promise<boolean> {
    saving.value = true;
    error.value = null;

    try {
      const response = await updateGraduationDocumentApi(id, content);
      const index = documents.value.findIndex(d => d.id === id);
      if (index !== -1) {
        documents.value[index] = response.document;
      }
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '保存失败';
      return false;
    } finally {
      saving.value = false;
    }
  }

  async function createDocument(projectId: number, docType: GraduationDocType): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await createGraduationDocumentApi(projectId, docType);
      const existing = documents.value.find(d => d.docType === docType);
      if (!existing) {
        documents.value.push(response.document);
      }
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '创建文档失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  async function generateDocument(
    projectId: number,
    docType: GraduationDocType,
    options: { forceRegenerate?: boolean } = {}
  ): Promise<boolean> {
    generationAbortController?.abort();
    generationAbortController = new AbortController();

    clearGenerationDisplay();
    generating.value = true;
    generatingDocType.value = docType;
    error.value = null;

    try {
      const response = await generateGraduationDocumentStreamApi(projectId, docType, {
        forceRegenerate: options.forceRegenerate === true,
        signal: generationAbortController.signal,
        onProgress(event) {
          if (event.contentText) {
            generationContent.value = event.contentText;
          }
          if (event.tokenCount !== undefined) {
            generationStats.value = {
              tokenCount: event.tokenCount,
              tokensPerSecond: event.tokensPerSecond ?? 0,
              elapsedSeconds: event.elapsedSeconds ?? 0
            };
          }
        }
      });

      const index = documents.value.findIndex(d => d.docType === docType);
      if (index !== -1) {
        documents.value[index] = response.document;
      } else {
        documents.value.push(response.document);
      }
      return true;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        return false;
      }
      error.value = e instanceof Error ? e.message : '生成失败';
      return false;
    } finally {
      generating.value = false;
      generatingDocType.value = null;
    }
  }

  function abortGeneration(): void {
    generationAbortController?.abort();
    generationAbortController = null;
    generating.value = false;
    generatingDocType.value = null;
  }

  function isGeneratingDocument(docType: GraduationDocType): boolean {
    return generating.value && generatingDocType.value === docType;
  }

  function getDocumentByType(docType: GraduationDocType): GraduationDocument | undefined {
    return documents.value.find(d => d.docType === docType);
  }

  function clearGenerationDisplay(): void {
    generationContent.value = '';
    generationStats.value = { tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 };
  }

  function $reset(): void {
    documents.value = [];
    currentProjectId.value = null;
    loading.value = false;
    generating.value = false;
    generatingDocType.value = null;
    generationContent.value = '';
    generationStats.value = { tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 };
    saving.value = false;
    error.value = null;
    generationAbortController = null;
  }

  return {
    documents,
    currentProjectId,
    loading,
    generating,
    generatingDocType,
    generationContent,
    generationStats,
    saving,
    error,
    allDocsGenerated,
    fetchDocuments,
    updateDocument,
    createDocument,
    generateDocument,
    abortGeneration,
    isGeneratingDocument,
    getDocumentByType,
    clearGenerationDisplay,
    $reset
  };
});
