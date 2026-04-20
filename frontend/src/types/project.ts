/**
 * Type definitions for Project (D-10, D-11)
 */

import type { ReviewResult } from './document';
import type { Domain, TopicType } from './topic';

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type PersistedReviewStatus = 'NONE' | 'PENDING_FIX' | 'ACCEPTED' | 'DISCARDED';

/**
 * Minimal topic info included in project response
 * From backend include: { select: { id, title, domain, type, techStack } }
 */
export interface ProjectTopic {
  id: number;
  title: string;
  domain: Domain;
  type: TopicType;
  techStack: string[];
}

export interface Project {
  id: number;
  userId: number;
  topicId: number;
  status: ProjectStatus;
  documentsRef: Record<string, any> | null;
  reviewStatus?: PersistedReviewStatus;
  reviewResult?: ReviewResult | null;
  createdAt: string;
  updatedAt: string;
  topic: ProjectTopic;
}

export interface ProjectDetail {
  id: number;
  status: ProjectStatus;
  techStack: string | null;
  reviewStatus: PersistedReviewStatus;
  reviewResult: ReviewResult | null;
  createdAt: string;
  updatedAt: string;
  topic: {
    title: string;
    domain: Domain;
  };
}

export interface ProjectsResponse {
  projects: Project[];
}

export interface CreateProjectInput {
  topicId: number;
}

export interface CreateProjectResponse {
  project: Project;
}

export interface DeleteProjectResponse {
  message: string;
}

export interface UpdateTechStackResponse {
  project: {
    id: number;
    techStack: string;
  };
}
