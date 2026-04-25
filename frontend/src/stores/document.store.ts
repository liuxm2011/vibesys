import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { fetchDocumentsApi, updateDocumentApi, createDocumentApi } from '@/api/document.api';
import { generateDocumentStreamApi } from '@/api/ai.api';
import { reviewDocumentsStreamApi, reviewDocumentsApi } from '@/api/review.api';
import type { Document, DocType, GenerateDocumentStreamProgress, ReviewResult, ReviewStatus, ReviewUnresolvedFix } from '@/types/document';
import type { PersistedReviewStatus } from '@/types/project';

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
  const generationContent = ref<string>('');       // Full streaming content for terminal display
  const generationStats = ref<{                   // Real-time generation stats
    tokenCount: number;
    tokensPerSecond: number;
    elapsedSeconds: number;
  }>({
    tokenCount: 0,
    tokensPerSecond: 0,
    elapsedSeconds: 0
  });
  const saving = ref(false);      // For save operations
  const error = ref<string | null>(null);

  // Review state
  const reviewing = ref(false);
  const reviewResult = ref<ReviewResult | null>(null);
  const fixing = ref(false);
  const fixingDocTypes = ref<DocType[]>([]);
  const unresolvedFixes = ref<ReviewUnresolvedFix[]>([]);
  const reviewStatus = ref<ReviewStatus>('idle');
  const reviewPhase = ref<string>(''); // Current review phase text for streaming UI
  const reviewLog = ref<string>(''); // Accumulated review log for TerminalGenerationOverlay

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
    unresolvedFixes.value = [];
    fixingDocTypes.value = [];

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

  // AbortController for interrupting in-progress generation (cross-project concurrency guard)
  let generationAbortController: AbortController | null = null;
  let reviewAbortController: AbortController | null = null;

  /**
   * Generate document via AI (DOC-04)
   * @param projectId Project ID
   * @param docType Document type to generate
   * @param options Generation behavior overrides
   * @returns true on success, false on failure
   */
  async function generateDocument(
    projectId: number,
    docType: DocType,
    options: { forceRegenerate?: boolean } = {}
  ): Promise<boolean> {
    // Abort any in-progress generation before starting a new one
    generationAbortController?.abort();
    generationAbortController = new AbortController();

    clearGenerationDisplay();
    generating.value = true;
    generatingDocType.value = docType;
    error.value = null;

    try {
      const response = await generateDocumentStreamApi(projectId, docType, {
        forceRegenerate: options.forceRegenerate === true,
        signal: generationAbortController.signal,
        onProgress(event) {
          generationPreviewLines.value = buildPreviewLines(event);
          // Update full content for terminal display
          if (event.contentText) {
            generationContent.value = event.contentText;
          }
          // Update stats if backend provides them
          if (event.tokenCount !== undefined) {
            generationStats.value = {
              tokenCount: event.tokenCount,
              tokensPerSecond: event.tokensPerSecond ?? 0,
              elapsedSeconds: event.elapsedSeconds ?? 0
            };
          }
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

  /**
   * Abort any in-progress document generation.
   * Call before navigating away from the project detail page.
   */
  function abortGeneration(): void {
    generationAbortController?.abort();
    generationAbortController = null;
    generating.value = false;
    generatingDocType.value = null;
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
   * Clear transient generation display state.
   * Keeps the document list untouched so the terminal can remain visible after completion.
   */
  function clearGenerationDisplay(): void {
    generationPreviewLines.value = [];
    generationContent.value = '';
    generationStats.value = { tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 };
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
   * Check if all 7 documents have been generated
   */
  const allDocsGenerated = computed(() =>
    hasPRD.value && hasFrontend.value && hasBackend.value &&
    hasAPI.value && hasTask.value && hasContextState.value && hasAgents.value
  );

  /**
   * Trigger expert panel review (streaming)
   */
  async function triggerReview(projectId: number): Promise<boolean> {
    reviewAbortController?.abort();
    reviewAbortController = new AbortController();

    reviewing.value = true;
    reviewStatus.value = 'reviewing';
    reviewPhase.value = '';
    reviewLog.value = '';
    error.value = null;
    unresolvedFixes.value = [];
    fixingDocTypes.value = [];

    try {
      const response = await reviewDocumentsStreamApi(projectId, 'review', {
        signal: reviewAbortController.signal,
        onPhase(phase) {
          reviewLog.value += `${phase}\n`;
          reviewPhase.value = reviewLog.value;
        }
      });
      if (response.review) {
        reviewLog.value += '\n审核完成';
        reviewPhase.value = reviewLog.value;
        hydrateReviewState('PENDING_FIX', response.review);
        return true;
      }
      error.value = '审核返回数据异常';
      return false;
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') {
        reviewStatus.value = 'idle';
        return false;
      }
      error.value = e instanceof Error ? e.message : '审核失败';
      reviewStatus.value = 'idle';
      return false;
    } finally {
      reviewing.value = false;
      reviewAbortController = null;
    }
  }

  function abortReview(): void {
    reviewAbortController?.abort();
    reviewAbortController = null;
    reviewing.value = false;
    reviewStatus.value = 'idle';
    reviewPhase.value = '';
    reviewLog.value = '';
  }

  /**
   * Apply fixes from review results
   */
  async function applyFixes(projectId: number): Promise<boolean> {
    if (!reviewResult.value) return false;

    fixing.value = true;
    reviewStatus.value = 'fixing';
    error.value = null;
    unresolvedFixes.value = [];

    const affectedTypes = new Set<DocType>();
    for (const issue of reviewResult.value.issues) {
      for (const t of issue.affectedDocTypes) {
        affectedTypes.add(t as DocType);
      }
    }
    fixingDocTypes.value = Array.from(affectedTypes);

    try {
      const response = await reviewDocumentsApi(projectId, 'fix');
      if (response.documents) {
        for (const updatedDoc of response.documents) {
          const index = documents.value.findIndex(d => d.id === updatedDoc.id);
          if (index !== -1) {
            documents.value[index] = updatedDoc;
          }
        }
        unresolvedFixes.value = response.unresolved || [];
        reviewStatus.value = 'fixed';
        return true;
      }
      error.value = '修复返回数据异常';
      return false;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '修复失败';
      reviewStatus.value = 'reviewed';
      return false;
    } finally {
      fixing.value = false;
    }
  }

  /**
   * Discard review results
   */
  async function discardReview(projectId: number): Promise<boolean> {
    error.value = null;

    try {
      const response = await reviewDocumentsApi(projectId, 'discard');
      if (response.success) {
        hydrateReviewState('DISCARDED', null);
        return true;
      }

      error.value = '放弃审核结果失败';
      return false;
    } catch (e) {
      error.value = e instanceof Error ? e.message : '放弃审核结果失败';
      return false;
    }
  }

  function hydrateReviewState(
    persistedStatus: PersistedReviewStatus | null | undefined,
    persistedResult: ReviewResult | null | undefined
  ): void {
    reviewResult.value = persistedResult || null;
    unresolvedFixes.value = [];
    fixingDocTypes.value = [];

    switch (persistedStatus) {
      case 'PENDING_FIX':
        reviewStatus.value = persistedResult ? 'reviewed' : 'idle';
        break;
      case 'ACCEPTED':
        reviewStatus.value = persistedResult ? 'fixed' : 'idle';
        break;
      case 'DISCARDED':
      case 'NONE':
      default:
        reviewResult.value = null;
        reviewStatus.value = 'idle';
        break;
    }
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
    generationContent.value = '';
    generationStats.value = { tokenCount: 0, tokensPerSecond: 0, elapsedSeconds: 0 };
    saving.value = false;
    error.value = null;
    reviewing.value = false;
    reviewResult.value = null;
    fixing.value = false;
    fixingDocTypes.value = [];
    unresolvedFixes.value = [];
    reviewStatus.value = 'idle';
    reviewPhase.value = '';
    reviewLog.value = '';
    generationAbortController = null;
    reviewAbortController = null;
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
    generationContent,
    generationStats,
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
    allDocsGenerated,
    // Review state
    reviewing,
    reviewResult,
    fixing,
    fixingDocTypes,
    unresolvedFixes,
    reviewStatus,
    reviewPhase,
    reviewLog,
    // Actions
    fetchDocuments,
    updateDocument,
    createDocument,
    generateDocument,
    abortGeneration,
    abortReview,
    isGeneratingDocument,
    getDocumentByType,
    clearGenerationDisplay,
    triggerReview,
    applyFixes,
    hydrateReviewState,
    discardReview,
    $reset
  };
});
