/**
 * Type definitions for Graduation Design Documents (毕设文档)
 * Separate document set for the graduation design workflow.
 */

export type GraduationDocType =
  | 'TASK_BOOK'       // 任务书
  | 'PROPOSAL'        // 开题报告
  | 'PREPARATION'     // 前期准备阶段
  | 'DRAFTING'        // 撰写阶段
  | 'MIDTERM_CHECK'   // 中期检查阶段
  | 'REFINEMENT'      // 完善阶段
  | 'SUMMARY';        // 个人学习工作总结

export interface GraduationDocument {
  id: number;
  projectId: number;
  docType: GraduationDocType;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface GraduationDocumentsResponse {
  documents: GraduationDocument[];
}

export interface CreateGraduationDocumentRequest {
  projectId: number;
  docType: GraduationDocType;
}

export interface CreateGraduationDocumentResponse {
  document: GraduationDocument;
}

export interface UpdateGraduationDocumentRequest {
  content: string;
}

export interface UpdateGraduationDocumentResponse {
  document: GraduationDocument;
}

export interface GenerateGraduationDocumentRequest {
  projectId: number;
  docType: GraduationDocType;
  forceRegenerate?: boolean;
}

export interface GenerateGraduationDocumentResponse {
  document: GraduationDocument;
}

export type HandbookNoteType = Exclude<GraduationDocType, 'TASK_BOOK' | 'PROPOSAL'>;

export interface HandbookProfile {
  cohort: string;
  college: string;
  englishTitle: string;
  topicCode: string;
  advisorName: string;
  advisorTitle: string;
  reviewerName: string;
  reviewerTitle: string;
  proposalDate: string;
  references: string;
  notes: Partial<Record<HandbookNoteType, string>>;
}

export interface GraduationCalendar {
  taskDeadline: string;
  taskLeaderSign: string;
  taskStudentAdvisorSign: string;
  proposalDeadline: string;
  preparationStart: string;
  preparationEnd: string;
  draftingStart: string;
  draftingEnd: string;
  midtermStart: string;
  midtermEnd: string;
  refinementStart: string;
  refinementEnd: string;
  summaryStart: string;
  summaryEnd: string;
  thesisDeadline: string;
  formReviewSign: string;
  evaluationStart: string;
  evaluationEnd: string;
  defenseDate: string;
  similarityLimit: number;
  aigcLimit: number;
}

export interface GraduationHandbookData {
  profile: HandbookProfile;
  calendar: GraduationCalendar | null;
  identity: { studentId: string; name: string; majorClass: string; title: string };
}
