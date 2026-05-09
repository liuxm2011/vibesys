/**
 * Type definitions for Project (D-10, D-11)
 */

import type { ReviewResult } from './document';
import type { Domain, TopicType, Platform } from './topic';

export type ProjectStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
export type PersistedReviewStatus = 'NONE' | 'PENDING_FIX' | 'ACCEPTED' | 'DISCARDED';

/**
 * Topic info included in project response
 * From backend include: { select: { id, title, description, domain, type, techStack } }
 */
export interface ProjectTopic {
  id: number;
  title: string;
  description: string;
  domain: Domain;
  platform: Platform;
  type: TopicType;
  techStack: string[];
}

export interface Project {
  id: number;
  userId: number;
  topicId: number;
  status: ProjectStatus;
  repoUrl?: string | null;
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
  repoUrl: string | null;
  repoSyncData: RepoSyncData | null;
  reviewStatus: PersistedReviewStatus;
  reviewResult: ReviewResult | null;
  createdAt: string;
  updatedAt: string;
  topic: {
    title: string;
    description: string;
    domain: Domain;
    platform: Platform;
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

export interface GiteeCommit {
  sha: string;
  message: string;
  authorName: string;
  authorDate: string;
}

export interface RepoSyncData {
  commits: GiteeCommit[];
  readme: string | null;
  syncedAt: string;
  commitCount: number;
}

export interface RepoInfoResponse {
  repoUrl: string | null;
  repoSyncData: RepoSyncData | null;
}

export interface SyncRepoResponse {
  syncData: RepoSyncData;
}

export interface ProjectRepoInfo {
  projectId: number;
  studentId: string;
  studentName: string;
  major: string;
  topicTitle: string;
  repoUrl: string | null;
  syncedAt: string | null;
  commitCount: number;
}
