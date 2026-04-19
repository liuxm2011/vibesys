import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchDocumentsApi, updateDocumentApi, createDocumentApi } from '@/api/document.api';
import { generateDocumentStreamApi } from '@/api/ai.api';
import type { Document, DocType, GenerateDocumentStreamProgress } from '@/types/document';

/**
 * Document Pinia store (DOC-01~05, D-12)
 * Manages document state and operations for project detail page
 */
export const useDocumentStore = defineStore('document', () => {
  // State
  const documents = ref<Document[]>([]);
  const currentProjectId = ref<number | null>(null);
  const techStack = ref<string[]>([]);
  const loading = ref(false);
  const generating = ref(false);  // For AI generation operations
  const generatingDocType = ref<DocType | null>(null);
  const generationPreviewLines = ref<string[]>([]);
  const saving = ref(false);      // For save operations
  const error = ref<string | null>(null);

  // Computed: Get specific document by type
  const prdDocument = computed(() =>
    documents.value.find(d => d.docType === 'PRD')
  );

  const frontendDocument = computed(() =>
    documents.value.find(d => d.docType === 'FRONTEND')
  );

  const backendDocument = computed(() =>
    documents.value.find(d => d.docType === 'BACKEND')
  );

  // Computed: Check if documents are generated
  const hasPRD = computed(() =>
    prdDocument.value && prdDocument.value.content.length > 0
  );

  const hasFrontend = computed(() =>
    frontendDocument.value && frontendDocument.value.content.length > 0
  );

  const hasBackend = computed(() =>
    backendDocument.value && backendDocument.value.content.length > 0
  );

  // New document types
  const apiDocument = computed(() =>
    documents.value.find(d => d.docType === 'API')
  );

  const taskDocument = computed(() =>
    documents.value.find(d => d.docType === 'TASK')
  );

  const contextStateDocument = computed(() =>
    documents.value.find(d => d.docType === 'CONTEXT_STATE')
  );

  const agentsDocument = computed(() =>
    documents.value.find(d => d.docType === 'AGENTS')
  );

  const hasAPI = computed(() =>
    apiDocument.value && apiDocument.value.content.length > 0
  );

  const hasTask = computed(() =>
    taskDocument.value && taskDocument.value.content.length > 0
  );

  const hasContextState = computed(() =>
    contextStateDocument.value && contextStateDocument.value.content.length > 0
  );

  const hasAgents = computed(() =>
    agentsDocument.value && agentsDocument.value.content.length > 0
  );

  /**
   * Fetch documents for a project (DOC-01~03)
   * @param projectId Project ID
   * @returns true on success, false on failure
   */
  async function fetchDocuments(projectId: number): Promise<boolean> {
    loading.value = true;
    error.value = null;
    currentProjectId.value = projectId;
    generating.value = false; // Reset generating on fresh fetch (D-12)
    generatingDocType.value = null;

    try {
      const response = await fetchDocumentsApi(projectId);
      documents.value = response.documents;
      techStack.value = response.techStack;
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '获取文档失败';
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Update document content (DOC-05, D-12 real-time save)
   * @param id Document ID
   * @param content New content
   * @returns true on success, false on failure
   */
  async function updateDocument(id: number, content: string): Promise<boolean> {
    saving.value = true;
    error.value = null;

    try {
      const response = await updateDocumentApi(id, content);
      // Update local state
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

  /**
   * Create empty document (lazy creation)
   * @param projectId Project ID
   * @param docType Document type
   * @returns true on success, false on failure
   */
  async function createDocument(projectId: number, docType: DocType): Promise<boolean> {
    loading.value = true;
    error.value = null;

    try {
      const response = await createDocumentApi(projectId, docType);
      // Add to local state if not exists
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

  /**
   * Generate document via AI (DOC-04)
   * @param projectId Project ID
   * @param docType Document type to generate
   * @returns true on success, false on failure
   */
  async function generateDocument(projectId: number, docType: DocType): Promise<boolean> {
    generating.value = true;
    generatingDocType.value = docType;
    generationPreviewLines.value = [];
    error.value = null;

    try {
      const response = await generateDocumentStreamApi(projectId, docType, {
        onProgress(event) {
          generationPreviewLines.value = buildPreviewLines(event);
        }
      });
      // Update local state
      const index = documents.value.findIndex(d => d.docType === docType);
      if (index !== -1) {
        documents.value[index] = response.document;
      } else {
        documents.value.push(response.document);
      }
      return true;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '生成失败';
      return false;
    } finally {
      generating.value = false;
      generatingDocType.value = null;
      generationPreviewLines.value = [];
    }
  }

  /**
   * Check whether a specific document type is currently generating.
   */
  function isGeneratingDocument(docType: DocType): boolean {
    return generating.value && generatingDocType.value === docType;
  }

  function buildPreviewLines(event: GenerateDocumentStreamProgress): string[] {
    const reasoningSegments = splitPreviewSegments(event.reasoningText)
      .slice(-2)
      .map(segment => `思考 ${segment}`);
    const contentSegments = splitPreviewSegments(event.contentText)
      .slice(-2)
      .map(segment => `输出 ${segment}`);

    if (event.phase === 'finalizing') {
      return ['正在整理最终文档结构并写入项目空间...', ...contentSegments].slice(-4);
    }

    return [...reasoningSegments, ...contentSegments].slice(-4);
  }

  function splitPreviewSegments(text: string): string[] {
    return text
      .split(/\r?\n|(?<=[。！？；])/)
      .map(segment => segment.trim())
      .filter(Boolean);
  }

  /**
   * Get document by type helper
   * @param docType Document type
   * @returns Document or undefined
   */
  function getDocumentByType(docType: DocType): Document | undefined {
    return documents.value.find(d => d.docType === docType);
  }

  /**
   * Reset store state
   */
  function $reset(): void {
    documents.value = [];
    currentProjectId.value = null;
    techStack.value = [];
    loading.value = false;
    generating.value = false;
    generatingDocType.value = null;
    generationPreviewLines.value = [];
    saving.value = false;
    error.value = null;
  }

  return {
    // State
    documents,
    currentProjectId,
    techStack,
    loading,
    generating,
    generatingDocType,
    generationPreviewLines,
    saving,
    error,
    // Computed
    prdDocument,
    frontendDocument,
    backendDocument,
    apiDocument,
    taskDocument,
    contextStateDocument,
    agentsDocument,
    hasPRD,
    hasFrontend,
    hasBackend,
    hasAPI,
    hasTask,
    hasContextState,
    hasAgents,
    // Actions
    fetchDocuments,
    updateDocument,
    createDocument,
    generateDocument,
    isGeneratingDocument,
    getDocumentByType,
    $reset
  };
});
