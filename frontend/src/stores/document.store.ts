import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchDocumentsApi, updateDocumentApi, createDocumentApi } from '@/api/document.api';
import { generateDocumentApi } from '@/api/ai.api';
import type { Document, DocType } from '@/types/document';

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
    error.value = null;

    try {
      const response = await generateDocumentApi(projectId, docType);
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
    }
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
    saving,
    error,
    // Computed
    prdDocument,
    frontendDocument,
    backendDocument,
    hasPRD,
    hasFrontend,
    hasBackend,
    // Actions
    fetchDocuments,
    updateDocument,
    createDocument,
    generateDocument,
    getDocumentByType,
    $reset
  };
});