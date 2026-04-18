/**
 * Type definitions for Topic (D-01, D-03, D-05)
 */

export type Domain = 'SE' | 'BD';

export type TopicType = 'SYSTEM' | 'CUSTOM';

export interface Topic {
  id: number;
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: Domain;
  techStack: string[];
  type: TopicType;
  creatorId?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface TopicsResponse {
  topics: Topic[];
}

export interface TopicDetailResponse {
  topic: Topic;
}

export interface CustomTopicInput {
  title: string;
  description: string;
  background?: string;
  objectives?: string;
  domain: Domain;
}

export interface CreateCustomTopicResponse {
  topic: Topic;
}