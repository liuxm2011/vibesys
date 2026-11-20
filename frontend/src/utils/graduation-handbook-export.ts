import DOMPurify from 'dompurify';
import { marked, type Token, type Tokens } from 'marked';
import type { GraduationDocType, GraduationDocument, GraduationHandbookData } from '@/types/graduation-document';
import { GRAD_DOC_GENERATION_ORDER } from './graduation-document-generation';
import {
  createGraduationWordDocument, type WordBlock, type WordCell, type WordParagraph, type WordTable,
} from './graduation-word';

const prefix = '萍乡学院本科生毕业设计';
const stageLabels = {
  PREPARATION: '前期准备阶段', DRAFTING: '撰写阶段', MIDTERM_CHECK: '中期检查阶段', REFINEMENT: '完善阶段',
} as const;

const sixColumns = [1360, 1730, 1360, 1730, 1360, 1870];
const compactColumns = [1360, 4980, 1000, 1000, 1070];
const scoreColumns = [1360, 5730, 1000, 1320];

export function safeGraduationFilename(value: string): string {
  return value.replace(/[<>:"/\\|?*\x00-\x1f]/g, '_').trim() || '毕业设计';
}

function dateText(date?: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

function dateRange(start?: string, end?: string): string {
  return start && end ? `自 ${dateText(start)} 至 ${dateText(end)}` : '';
}

const text = (value = '', style: WordParagraph['style'] = 'body', align?: WordParagraph['align']): WordParagraph =>
  ({ text: value, style, align });
const cell = (value = '', span = 1, align: WordParagraph['align'] = 'center'): WordCell =>
  ({ paragraphs: [text(value, 'body', align)], span });
const labelCell = (label: string, merge?: WordCell['merge']): WordCell =>
  ({ paragraphs: [text(label, 'body', 'center')], vertical: Boolean(label), merge });
const bodyCell = (paragraphs: WordParagraph[], span: number): WordCell => ({ paragraphs, span });
const signature = (label: string, date?: string) =>
  text(`${label}签名：__________________　　　${dateText(date) || '日期：____________'}`);
const title = (value: string, pageBreakBefore = true): WordParagraph =>
  ({ ...text(value, 'title', 'center'), pageBreakBefore });

function identityRows(data: GraduationHandbookData): WordCell[][] {
  const { identity, profile } = data;
  return [
    [cell('学生学号'), cell(identity.studentId), cell('学生姓名'), cell(identity.name), cell('专业班级'), cell(identity.majorClass)],
    [cell('中文题目'), cell(identity.title, 5)],
    [cell('英文题目'), cell(profile.englishTitle, 5)],
  ];
}

function visibleInline(value: string): string {
  const html = DOMPurify.sanitize(marked.parseInline(value, { async: false }));
  return new DOMParser().parseFromString(html, 'text/html').body.textContent ?? '';
}

function paragraphsFromTokens(tokens: Token[]): WordParagraph[] {
  return tokens.flatMap((token): WordParagraph[] => {
    switch (token.type) {
      case 'space':
        return [];
      case 'heading':
        return [text(visibleInline((token as Tokens.Heading).text), 'heading')];
      case 'list': {
        const list = token as Tokens.List;
        const start = typeof list.start === 'number' ? list.start : 1;
        return list.items.flatMap((item, index) => {
          const [first, ...rest] = paragraphsFromTokens(item.tokens);
          const lead = list.ordered ? `${start + index}. ` : '• ';
          return first ? [{ ...first, text: lead + first.text }, ...rest] : [];
        });
      }
      case 'blockquote':
        return paragraphsFromTokens((token as Tokens.Blockquote).tokens);
      case 'table': {
        const table = token as Tokens.Table;
        return [table.header, ...table.rows].map(row => text(row.map(entry => visibleInline(entry.text)).join('　｜　')));
      }
      default:
        return [text(visibleInline((token as Tokens.Generic).text ?? token.raw))];
    }
  });
}

function markdownParagraphs(value: string): WordParagraph[] {
  return paragraphsFromTokens(marked.lexer(value, { gfm: true }));
}

function splitSections(content: string): { preamble: string; sections: Array<[string, string]> } {
  const tokens = marked.lexer(content, { gfm: true });
  const sections: Array<[string, string]> = [];
  let preamble = '';
  for (const token of tokens) {
    if (token.type === 'heading' && (token as Tokens.Heading).depth === 1) continue;
    if (token.type === 'heading' && (token as Tokens.Heading).depth === 2) {
      sections.push([(token as Tokens.Heading).text, '']);
    } else if (sections.length) {
      sections[sections.length - 1][1] += token.raw;
    } else {
      preamble += token.raw;
    }
  }
  return { preamble, sections };
}

const taskSections = ['研究主要内容及基本要求', '主要参考资料', '进程计划', '毕业设计工作指导小组审核意见', '签名'];
const proposalSections = ['一、文献综述', '二、主要内容', '三、详细提纲', '四、参考文献', '五、进程计划', '签名'];

function typeTitle(type: GraduationDocType): string {
  if (type === 'TASK_BOOK') return prefix + '任务书';
  if (type === 'PROPOSAL') return prefix + '开题报告';
  if (type === 'SUMMARY') return prefix + '个人学习工作总结';
  return prefix + '进展情况记录';
}

function addBodyRow(rows: WordCell[][], label: string, body: WordParagraph[]) {
  rows.push([labelCell(label), bodyCell(body.length ? body : [text('')], 5)]);
}

function addSavedSections(rows: WordCell[][], type: GraduationDocType, content: string, data: GraduationHandbookData) {
  const { sections, preamble } = splitSections(content);
  const byName = new Map(sections);
  const { calendar, profile } = data;
  const recordName = type === 'SUMMARY' ? '学习工作总结' : '进展情况记录';
  const expected = type === 'TASK_BOOK' ? taskSections : type === 'PROPOSAL' ? proposalSections : [recordName, '指导教师意见'];
  const currentFormat = content.trimStart().startsWith('# ' + typeTitle(type))
    && expected.every(name => byName.has(name));

  if (!currentFormat && content.trim()) {
    const paragraphs = markdownParagraphs(preamble);
    for (const [heading, value] of sections) paragraphs.push(text(heading, 'heading'), ...markdownParagraphs(value));
    addBodyRow(rows, type === 'PROPOSAL' ? '开题报告内容' : '文档内容', paragraphs);
    return;
  }

  if (type === 'TASK_BOOK') {
    const blank: Record<string, WordParagraph[]> = {
      研究主要内容及基本要求: [text('一、主要研究内容', 'heading'), text(''), text('二、基本要求', 'heading'), text('')],
      毕业设计工作指导小组审核意见: [text(''), text(''), signature('教学学院毕业设计工作指导小组组长', calendar?.taskLeaderSign)],
      签名: [signature('学生', calendar?.taskStudentAdvisorSign), signature('指导教师', calendar?.taskStudentAdvisorSign)],
    };
    for (const name of expected) {
      const value = byName.get(name);
      addBodyRow(rows, name, value ? markdownParagraphs(value) : blank[name] ?? [text('待填写')]);
    }
  } else if (type === 'PROPOSAL') {
    const body = expected.slice(0, -1).flatMap(name => [text(name, 'heading'), ...markdownParagraphs(byName.get(name) || '待填写')]);
    const date = profile.proposalDate || calendar?.proposalDeadline;
    body.push(...(byName.get('签名') ? markdownParagraphs(byName.get('签名')!) : [signature('学生', date), signature('指导教师', date)]));
    addBodyRow(rows, '开题报告内容', body);
  } else {
    const dates = stagePeriod(type, data);
    const emptyProgress = [text('待填写'), text(''), text('')];
    if (type === 'MIDTERM_CHECK' && calendar) {
      emptyProgress.push(text(`检测要求：论文查重 ＜${calendar.similarityLimit}%，AIGC 检测 ＜${calendar.aigcLimit}%。`),
        text('检测记录（按实际报告填写）：______________________________'));
    }
    addBodyRow(rows, recordName, byName.has(recordName) ? markdownParagraphs(byName.get(recordName)!) : [...emptyProgress, signature('学生', dates.end)]);
    addBodyRow(rows, '指导教师意见', byName.has('指导教师意见') ? markdownParagraphs(byName.get('指导教师意见')!) : [text(''), text(''), signature('指导教师', dates.end)]);
  }

  // Preserve extra sections added by the student in the editor.
  for (const [name, value] of sections) {
    if (!expected.includes(name)) addBodyRow(rows, name, markdownParagraphs(value));
  }
}

function stagePeriod(type: Exclude<GraduationDocType, 'TASK_BOOK' | 'PROPOSAL'>, data: GraduationHandbookData) {
  const dates = data.calendar;
  if (!dates) return { start: '', end: '' };
  const ranges = {
    PREPARATION: [dates.preparationStart, dates.preparationEnd],
    DRAFTING: [dates.draftingStart, dates.draftingEnd],
    MIDTERM_CHECK: [dates.midtermStart, dates.midtermEnd],
    REFINEMENT: [dates.refinementStart, dates.refinementEnd],
    SUMMARY: [dates.summaryStart, dates.summaryEnd],
  };
  const [start, end] = ranges[type];
  return { start, end };
}

function documentBlocks(type: GraduationDocType, content: string, data: GraduationHandbookData, pageBreakBefore: boolean): WordBlock[] {
  const rows = identityRows(data);
  const blocks: WordBlock[] = [title(typeTitle(type), pageBreakBefore)];
  const { profile } = data;
  if (type === 'PROPOSAL') {
    const { identity } = data;
    rows.splice(0, 1,
      [cell('学生学号'), cell(identity.studentId, 2), cell('学生姓名'), cell(identity.name, 2)],
      [cell('教学学院'), cell(profile.college, 2), cell('专业班级'), cell(identity.majorClass, 2)],
      [cell('选题编号'), cell(profile.topicCode, 2), cell('届别'), cell(profile.cohort, 2)],
      [cell('指导教师姓名及职称'), cell([profile.advisorName, profile.advisorTitle].filter(Boolean).join(' '), 5)],
    );
  } else if (type !== 'TASK_BOOK') {
    if (type !== 'SUMMARY') blocks.push(text(`（${stageLabels[type]}）`, 'subtitle', 'center'));
    const { start, end } = stagePeriod(type, data);
    rows.push([cell('时间'), cell(dateRange(start, end), 5)]);
  }
  addSavedSections(rows, type, content, data);
  blocks.push({ columns: sixColumns, rows });
  return blocks;
}

const reviewItems = [
  '封面填写完整正确（含外文题目）', '文稿为 A4 打印稿', '文字编排格式规范统一',
  '有中文摘要（含中文关键词）', '中文关键词为 3–5 个', '有外文摘要（含外文关键词）',
  '有目录（标题文字、页码与内文相符）', '正文有小标题', '正文标点符号使用正确', '正文无错别字或病句',
  '参考文献数量符合要求', '参考文献含外文资料', '参考文献含最新期刊资料',
  '参考文献序号在文中有标注', '参考文献格式规范', '进展情况记录含中期自查',
  '过程手册含个人学习工作总结', '进展情况记录反映学生实际工作', '进展情况记录填写完整',
  '进展情况记录内容无逻辑错误', '图表设计与绘制规范', '程序载体或电子稿按要求提交',
];

function formalReview(data: GraduationHandbookData): WordBlock[] {
  const rows = identityRows(data);
  const date = data.calendar?.formReviewSign;
  addBodyRow(rows, '指导教师审查意见', [text('形式审查合格（　）　不合格（　）'), text(''), signature('指导教师', date)]);
  addBodyRow(rows, '核查意见', [text('形式审查合格（　）　不合格（　）'), text(''), signature('教学学院毕业设计工作指导小组组长', date)]);
  const checklist: WordTable = {
    columns: compactColumns,
    rows: [
      [labelCell('形式审查内容', 'restart'), cell('项目'), cell('是'), cell('否'), cell('无')],
      ...reviewItems.map(item => [labelCell('', 'continue'), cell(item, 1, 'left'), cell(), cell(), cell()]),
    ],
  };
  return [title(prefix + '形式审查表'), { columns: sixColumns, rows: rows.slice(0, 3) }, checklist, { columns: sixColumns, rows: rows.slice(3) }];
}

const evaluationGroups = [
  { label: '选题质量 20%', items: [
    ['选题符合专业培养目标，体现综合训练基本要求', 6], ['题目难易度', 4],
    ['题目工作量', 5], ['题目同生产、科研或实验室建设的结合程度', 5],
  ] },
  { label: '毕业设计质量 80%', items: [
    ['综合运用知识', 8], ['查阅文献资料及资料应用', 7], ['实验设计', 7], ['计算能力', 6],
    ['外语应用', 6], ['计算机应用', 6], ['创新', 7], ['分析实验结果或开展综合分析的能力', 7],
    ['插图或图纸质量', 6], ['设计说明书撰写水平', 7], ['设计的实用性与科学性', 6], ['设计规范化程度', 7],
  ] },
] as const;

function teacherEvaluation(data: GraduationHandbookData, reviewer: boolean): WordBlock[] {
  const role = reviewer ? '评阅教师' : '指导教师';
  const { profile, calendar } = data;
  const rows = identityRows(data);
  rows.unshift([cell(role + '姓名'), cell(reviewer ? profile.reviewerName : profile.advisorName),
    cell('专业技术职务'), cell(reviewer ? profile.reviewerTitle : profile.advisorTitle), cell('工作单位'), cell()]);
  const scoring: WordTable = {
    columns: scoreColumns,
    rows: [
      [cell(role + '评分', 4)],
      [cell('指标'), cell('考核项目'), cell('满分'), cell('评分')],
      ...evaluationGroups.flatMap(group => group.items.map(([item, max], index) => [
        { ...cell(index ? '' : group.label), merge: index ? 'continue' as const : 'restart' as const },
        cell(item, 1, 'left'), cell(String(max)),
        { ...cell(), merge: index ? 'continue' as const : 'restart' as const },
      ])),
      [cell('总分（百分制）', 3), cell()],
    ],
  };
  const range = dateRange(calendar?.evaluationStart, calendar?.evaluationEnd);
  const opinion: WordTable = { columns: sixColumns, rows: [] };
  addBodyRow(opinion.rows, role + '意见', [
    text(role + '评语：'), text(''), text(''),
    text('评阅合格，建议提交答辩　是（　）　否（　）'),
    ...(range ? [text(`签署区间：${range}，指导教师先签，评阅教师后签。`)] : []),
    signature(role),
  ]);
  return [title(prefix + role + '评价表'), { columns: sixColumns, rows }, scoring, opinion];
}

const defenseGroups = [
  { label: '毕业设计质量 50%', items: ['写作水平', '规范程度', '完成情况', '成果技术水平', '设计的正确性、创造性和实用性'] },
  { label: '答辩表现 50%', items: ['仪表', '内容陈述', '回答问题正确性'] },
];

function defense(data: GraduationHandbookData): WordBlock[] {
  const { profile, calendar } = data;
  const rows = identityRows(data);
  rows.splice(1, 0, [cell('选题编号'), cell(profile.topicCode, 2), cell('届别'), cell(profile.cohort, 2)]);
  rows.push([cell('陈述时间'), cell('　分钟', 2), cell('问答时间'), cell('　分钟', 2)]);
  addBodyRow(rows, '答辩记录', [text(''), text(''), text(''), signature('记录人', calendar?.defenseDate)]);
  addBodyRow(rows, '答辩小组评语', [text(''), text(''), signature('答辩小组成员', calendar?.defenseDate)]);
  const scoreRows: WordCell[][] = [
    [cell('指标', 2), cell('考核项目'), cell('评分')],
    ...defenseGroups.flatMap((group, groupIndex) => group.items.map((item, index) => [
      { ...cell(groupIndex === 0 && index === 0 ? '答辩评分 40%' : ''), merge: groupIndex === 0 && index === 0 ? 'restart' as const : 'continue' as const },
      { ...cell(index ? '' : group.label), merge: index ? 'continue' as const : 'restart' as const },
      cell(item, 1, 'left'), { ...cell(), merge: index ? 'continue' as const : 'restart' as const },
    ])),
    [cell(), cell('总分'), cell('（百分制）'), cell()],
    [cell('签名', 2), bodyCell([signature('答辩小组组长', calendar?.defenseDate)], 2)],
    [cell('指导教师评分 30%', 2), cell('（百分制）'), cell()],
    [cell('评阅教师评分 30%', 2), cell('（百分制）'), cell()],
    [cell('总分', 2), cell('答辩评分 × 40% + 指导教师评分 × 30% + 评阅教师评分 × 30%'), cell()],
    [cell('成绩总评', 2), bodyCell([text('（五级记分制）'), text(''), signature('教学学院毕业设计领导小组组长')], 2)],
  ];
  return [
    title(prefix + '答辩评分及成绩评定表'),
    { columns: sixColumns, rows },
    { columns: [1300, 1400, 5390, 1320], rows: scoreRows },
    text('注：此表由答辩小组组织填写。'),
  ];
}

function coverAndInstructions(data: GraduationHandbookData): WordBlock[] {
  const { profile, identity } = data;
  return [
    text(''), text(''), text('萍乡学院', 'title', 'center'), text(''), text(''),
    text('本科生毕业设计', 'title', 'center'), text('过程管理手册', 'title', 'center'), text(''), text(''),
    { columns: sixColumns, rows: [
      [cell('学生学号'), cell(identity.studentId, 2), cell('学生姓名'), cell(identity.name, 2)],
      [cell('教学学院'), cell(profile.college, 2), cell('届别'), cell(profile.cohort, 2)],
      [cell('专业班级'), cell(identity.majorClass, 5)],
      [cell('指导教师姓名及职称'), cell([profile.advisorName, profile.advisorTitle].filter(Boolean).join(' '), 5)],
      [cell('评阅教师姓名及职称'), cell([profile.reviewerName, profile.reviewerTitle].filter(Boolean).join(' '), 5)],
    ] },
    text(''), text(''), text('萍乡学院教务处制', 'subtitle', 'center'),
    title('说明'),
    text('1. 任务书由指导教师与学生共同商定，由指导教师填写，经教学学院毕业设计工作指导小组（教研室）审核后发给学生。'),
    text('2. 学生撰写开题报告，如实填写各阶段进展情况记录和个人学习工作总结。'),
    text('3. 手册各部分由相应人员填写并签名。'),
    text('4. 装订顺序为任务书、开题报告、四阶段进展记录、个人学习工作总结、形式审查表、指导教师评价表、评阅教师评价表、答辩评分及成绩评定表。'),
    text('5. 按教学学院要求提交归档。'),
  ];
}

export function buildGraduationWord(doc: GraduationDocument, data: GraduationHandbookData): Promise<Blob> {
  return createGraduationWordDocument(documentBlocks(doc.docType, doc.content, data, false));
}

export function buildGraduationHandbookWord(docs: GraduationDocument[], data: GraduationHandbookData): Promise<Blob> {
  const saved = new Map(docs.map(doc => [doc.docType, doc.content]));
  return createGraduationWordDocument([
    ...coverAndInstructions(data),
    ...GRAD_DOC_GENERATION_ORDER.flatMap(type => documentBlocks(type, saved.get(type) || '', data, true)),
    ...formalReview(data),
    ...teacherEvaluation(data, false),
    ...teacherEvaluation(data, true),
    ...defense(data),
  ]);
}
