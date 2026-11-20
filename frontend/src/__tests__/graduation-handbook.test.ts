import { expect, test } from 'vitest';
import JSZip from 'jszip';
import { buildGraduationDownloadHtml } from '@/utils/graduation-download';
import { buildGraduationHandbookWord, buildGraduationWord } from '@/utils/graduation-handbook-export';
import type { GraduationDocument, GraduationHandbookData } from '@/types/graduation-document';

const data: GraduationHandbookData = {
  identity: { studentId: '20270001', name: '学生甲', majorClass: '大数据 2301', title: '气象数据分析' },
  profile: {
    cohort: '2027', college: '信息与计算机工程学院', englishTitle: 'Weather & Forecasting', topicCode: 'TEST001',
    advisorName: '指导教师甲', advisorTitle: '讲师', reviewerName: '评阅教师乙', reviewerTitle: '副教授',
    proposalDate: '', references: '', notes: {},
  },
  calendar: {
    taskDeadline: '2026-11-20', taskLeaderSign: '2026-11-20', taskStudentAdvisorSign: '2026-11-23',
    proposalDeadline: '2026-12-25', preparationStart: '2026-11-23', preparationEnd: '2026-12-25',
    draftingStart: '2026-12-26', draftingEnd: '2027-02-21', midtermStart: '2027-02-22', midtermEnd: '2027-04-02',
    refinementStart: '2027-04-03', refinementEnd: '2027-04-16', summaryStart: '2026-11-23', summaryEnd: '2027-04-16',
    thesisDeadline: '2027-04-21', formReviewSign: '2027-04-23', evaluationStart: '2027-04-24',
    evaluationEnd: '2027-05-07', defenseDate: '2027-05-08', similarityLimit: 30, aigcLimit: 40,
  },
};

const task: GraduationDocument = {
  id: 1, projectId: 1, docType: 'TASK_BOOK', createdAt: '', updatedAt: '',
  content: [
    '# 萍乡学院本科生毕业设计任务书',
    '| 项目 | 内容 |\n| --- | --- |\n| 中文题目 | 气象数据分析 |',
    '## 研究主要内容及基本要求\n\n### 一、主要研究内容\n\n1. 对样本做特征提取。\n2. 训练用于预测的模型。',
    '## 主要参考资料\n\n待补充。',
    '## 进程计划\n\n- 完成实验。',
    '## 毕业设计工作指导小组审核意见\n\n组长签名：__________________',
    '## 签名\n\n学生签名：__________________',
  ].join('\n\n'),
};

async function readDocument(blob: Blob): Promise<Document> {
  const bytes = await new Promise<ArrayBuffer>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.readAsArrayBuffer(blob);
  });
  const file = await JSZip.loadAsync(bytes);
  expect(file.file('_rels/.rels')).not.toBeNull();
  expect(file.file('[Content_Types].xml')).not.toBeNull();
  const xml = await file.file('word/document.xml')!.async('text');
  const doc = new DOMParser().parseFromString(xml, 'application/xml');
  expect(doc.querySelector('parsererror')).toBeNull();
  return doc;
}

test('HTML 下载正常渲染 Markdown 表格和列表，并清理不安全的标签', () => {
  const html = buildGraduationDownloadHtml('气象分析', '任务书', task.content + '\n\n<script>alert(1)</script>');
  const document = new DOMParser().parseFromString(html, 'text/html');
  expect(document.querySelector('table td')?.textContent).toBe('中文题目');
  expect(document.querySelector('ol li')?.textContent).toBe('对样本做特征提取。');
  expect(document.querySelector('script')).toBeNull();
});

test('Word 单份导出保留栏目与正文，整册附空白审查、评价和答辩表', async () => {
  const single = await readDocument(await buildGraduationWord(task, data));
  const singleText = single.documentElement.textContent!;
  expect(singleText).toContain('Weather & Forecasting');
  expect(singleText).toContain('1. 对样本做特征提取。');
  expect(singleText).not.toContain('形式审查表');
  expect(single.getElementsByTagName('w:gridSpan').length).toBeGreaterThan(0);

  const full = await readDocument(await buildGraduationHandbookWord([task], data));
  const sections = [
    '过程管理手册', '任务书', '开题报告', '（前期准备阶段）', '（撰写阶段）', '（中期检查阶段）', '（完善阶段）',
    '个人学习工作总结', '形式审查表', '指导教师评价表', '评阅教师评价表', '答辩评分及成绩评定表',
  ];
  const body = full.documentElement.textContent!;
  let last = -1;
  for (const section of sections) {
    const at = body.indexOf(section, last + 1);
    expect(at).toBeGreaterThan(last);
    last = at;
  }
  expect(body).toContain('论文查重 ＜30%，AIGC 检测 ＜40%');
  expect(body).toContain('评阅教师乙');
  expect(body).toContain('2027 年 5 月 8 日');
  expect(body).toContain('是（　）　否（　）');
  expect(body).not.toContain('√');
  expect(full.getElementsByTagName('w:pageBreakBefore')).toHaveLength(12);
});

test('Word 导出仍保留旧版已填写内容', async () => {
  const legacy = { ...task, content: '## 一、主要内容\n\n旧项目已有正文。' };
  const file = await readDocument(await buildGraduationWord(legacy, data));
  expect(file.documentElement.textContent).toContain('旧项目已有正文。');
});
