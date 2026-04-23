import { Platform, type TechOption, TechCategory } from '../types/topic';

const ALL_PLATFORMS: Platform[] = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];

export const TECH_OPTIONS: TechOption[] = [
  // 前端框架
  { name: 'Vue 3', category: TechCategory.FRONTEND, recommended: true, platforms: ['WEB', 'WECHAT_MINI'] },
  { name: 'React', category: TechCategory.FRONTEND, platforms: ['WEB', 'WECHAT_MINI'] },
  { name: 'Angular', category: TechCategory.FRONTEND, platforms: ['WEB'] },
  // 前端 UI
  { name: 'Element Plus', category: TechCategory.FRONTEND, recommended: true, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Ant Design', category: TechCategory.FRONTEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Tailwind CSS', category: TechCategory.FRONTEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Bootstrap', category: TechCategory.FRONTEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  // 后端框架
  { name: 'Node.js + Express', category: TechCategory.BACKEND, recommended: true, platforms: ['WEB', 'WECHAT_MINI'] },
  { name: 'Spring Boot', category: TechCategory.BACKEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Python + Flask', category: TechCategory.BACKEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Django', category: TechCategory.BACKEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Go', category: TechCategory.BACKEND, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  // 数据库
  { name: 'MySQL', category: TechCategory.DATABASE, recommended: true, platforms: ALL_PLATFORMS },
  { name: 'PostgreSQL', category: TechCategory.DATABASE, platforms: ALL_PLATFORMS },
  { name: 'MongoDB', category: TechCategory.DATABASE, platforms: ALL_PLATFORMS },
  { name: 'Redis', category: TechCategory.DATABASE, platforms: ALL_PLATFORMS },
  // 开发工具
  { name: 'Docker', category: TechCategory.TOOLING, platforms: ALL_PLATFORMS },
  { name: 'Nginx', category: TechCategory.TOOLING, platforms: ['WEB', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'TypeScript', category: TechCategory.TOOLING, recommended: true, platforms: ['WEB', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
  { name: 'Vite', category: TechCategory.TOOLING, recommended: true, platforms: ['WEB', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'] },
];

/**
 * Filter tech options by platform.
 * If no platforms array is defined for an option, it's shown for all platforms.
 */
export function getTechOptionsByPlatform(platform: Platform): TechOption[] {
  return TECH_OPTIONS.filter(t => !t.platforms || t.platforms.includes(platform));
}

export function getRecommendedTech(): TechOption[] {
  return TECH_OPTIONS.filter(t => t.recommended);
}

export function getRecommendedTechByPlatform(platform: Platform): TechOption[] {
  return getTechOptionsByPlatform(platform).filter(t => t.recommended);
}
