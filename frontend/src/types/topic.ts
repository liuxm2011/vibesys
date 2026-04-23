/**
 * Type definitions for Topic (D-01, D-03, D-05)
 */

export type Domain = 'SE' | 'BD';

export type TopicType = 'SYSTEM' | 'CUSTOM';

export type Platform = 'WEB' | 'IOS' | 'ANDROID' | 'WECHAT_MINI' | 'WINDOWS_DESKTOP' | 'MAC_DESKTOP';

export const PLATFORM_LABELS: Record<Platform, { name: string; icon: string; desc: string }> = {
  WEB: { name: 'Web App', icon: '🌐', desc: '浏览器访问，跨平台' },
  IOS: { name: 'iOS', icon: '🍎', desc: 'iPhone / iPad 原生应用' },
  ANDROID: { name: 'Android', icon: '🤖', desc: 'Android 手机原生应用' },
  WECHAT_MINI: { name: '微信小程序', icon: '💬', desc: '微信生态内运行' },
  WINDOWS_DESKTOP: { name: 'Windows桌面端', icon: '🖥️', desc: 'Windows PC 桌面程序' },
  MAC_DESKTOP: { name: 'Mac桌面端', icon: '🍏', desc: 'macOS 桌面程序' },
};

/** Tech stack categories for the wizard */
export enum TechCategory {
  FRONTEND = '前端框架',
  BACKEND = '后端框架',
  DATABASE = '数据库',
  TOOLING = '开发工具',
}

/** Tech option displayed in the wizard checkbox list */
export interface TechOption {
  name: string;
  category: TechCategory;
  recommended?: boolean;
  platforms?: Platform[];
}

export interface Topic {
  id: number;
  title: string;
  description: string;
  background: string;
  objectives: string;
  domain: Domain;
  platform: Platform;
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
  platform: Platform;
  techStack?: string[];
}

export interface CreateCustomTopicResponse {
  topic: Topic;
}