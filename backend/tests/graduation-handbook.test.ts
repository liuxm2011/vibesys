import { expect, test } from 'vitest';
import { buildHandbookPrompts, renderHandbookDocument } from '../src/services/graduation-handbook-document.js';
import { defaultGraduationCalendars, parseHandbookProfile, validateGraduationCalendars } from '../src/services/graduation-handbook.js';

const calendars = JSON.parse(defaultGraduationCalendars);
const profile = parseHandbookProfile({
  englishTitle: 'Weather Analysis & Forecasting',
  advisorName: '指导教师甲',
  advisorTitle: '讲师',
  topicCode: 'TEST001',
  proposalDate: '2026-12-24',
  references: '[1] 学生已核实的资料。',
  notes: { PREPARATION: '已分析数据缺失情况。', SUMMARY: '对处理缺失值的方法有了认识。' },
})!;
const topic = {
  title: '气象数据分析', description: '对观测数据开展分析', domain: 'BD', platform: 'WEB',
  objectives: '', techStack: ['Python'], studentId: '20270001', studentName: '学生甲', major: '大数据',
  className: '2301', handbook: profile, calendar: calendars['2027'],
};
const previous = { prdContent: '', frontendContent: '', backendContent: '', taskBookContent: '', proposalContent: '' };

test('任务书和开题报告共用已确认课题信息、调整后的开题日与本届阶段日', () => {
  const task = renderHandbookDocument('TASK_BOOK', topic, '# 正文草稿\n## 主要研究内容\n分析气象数据。\n## 基本要求\n完成实验。\n## 计划-中期检查阶段\n2023 年交材料。');
  expect(task).toContain('Weather Analysis & Forecasting');
  expect(task).toContain('2026 年 12 月 24 日');
  expect(task).toContain('2027 年 4 月 2 日');
  expect(task).toContain('毕业设计工作指导小组审核意见');
  expect(task).toContain('2026 年 11 月 20 日');
  expect(task).toContain('2026 年 11 月 23 日');
  expect(task).not.toContain('2023 年');

  const proposal = renderHandbookDocument('PROPOSAL', topic, '# 正文草稿\n## 文献综述\n现状。\n## 主要内容\n研究内容。\n## 详细提纲\n### 1.1 研究目标\n评估模型。');
  expect(proposal.indexOf('四、参考文献')).toBeLessThan(proposal.indexOf('五、进程计划'));
  expect(proposal).toContain('Weather Analysis & Forecasting');
  expect(proposal).toContain('2026 年 12 月 24 日');
  expect(proposal).toContain('指导教师甲 讲师');
  expect(proposal).toContain('TEST001');
  expect(proposal).toContain('学生已核实的资料。');
});

test('阶段记录和个人总结只使用提供的工作内容，教师意见留空', () => {
  const prompts = buildHandbookPrompts('PREPARATION', topic, previous);
  expect(prompts.userPrompt).toContain('已分析数据缺失情况。');
  const prep = renderHandbookDocument('PREPARATION', topic, '# 正文草稿\n## 进展情况记录\n1. 已分析数据缺失情况。\n## 指导教师意见\n建议通过。');
  expect(prep).toContain('前期准备阶段');
  expect(prep).toContain('自 2026 年 11 月 23 日 至 2026 年 12 月 25 日');
  expect(prep).not.toContain('建议通过。');

  const summaryPrompt = buildHandbookPrompts('SUMMARY', topic, { ...previous, progressContents: [prep] });
  expect(summaryPrompt.userPrompt).toContain('已分析数据缺失情况。');
  expect(summaryPrompt.userPrompt).toContain('对处理缺失值的方法有了认识。');
  expect(summaryPrompt.userPrompt).not.toContain('指导教师签名');
  const summary = renderHandbookDocument('SUMMARY', topic);
  expect(summary).toContain('个人学习工作总结');
  expect(summary).toContain('自 2026 年 11 月 23 日 至 2027 年 4 月 16 日');
});

test('验证日历实际日期及顺序，非 2027 届缺日历时不沿用日期', () => {
  expect(validateGraduationCalendars(defaultGraduationCalendars)).toBeNull();
  expect(validateGraduationCalendars(JSON.stringify({ '2027': { ...calendars['2027'], midtermEnd: '2027-02-30' } }))).not.toBeNull();
  expect(validateGraduationCalendars(JSON.stringify({ '2027': { ...calendars['2027'], defenseDate: '2027-05-01' } }))).not.toBeNull();
  expect(parseHandbookProfile({ proposalDate: '2026-02-29' })).toBeNull();
  expect(renderHandbookDocument('MIDTERM_CHECK', { ...topic, calendar: null })).not.toContain('2027 年');
});
