import type { PrismaClient } from '../generated/prisma';

export const GRADUATION_STAGE_LABELS = {
  PREPARATION: '前期准备阶段',
  DRAFTING: '撰写阶段',
  MIDTERM_CHECK: '中期检查阶段',
  REFINEMENT: '完善阶段',
} as const;

export type GraduationStage = keyof typeof GRADUATION_STAGE_LABELS;
export const GRADUATION_STAGES = Object.keys(GRADUATION_STAGE_LABELS) as GraduationStage[];
export const HANDBOOK_DOCUMENT_TYPES = ['TASK_BOOK', 'PROPOSAL', ...GRADUATION_STAGES, 'SUMMARY'] as const;
export type HandbookDocumentType = typeof HANDBOOK_DOCUMENT_TYPES[number];

export function isHandbookDocumentType(value: unknown): value is HandbookDocumentType {
  return HANDBOOK_DOCUMENT_TYPES.some(type => type === value);
}

const defaultCalendar = {
  taskDeadline: '2026-11-20',
  taskLeaderSign: '2026-11-20',
  taskStudentAdvisorSign: '2026-11-23',
  proposalDeadline: '2026-12-25',
  preparationStart: '2026-11-23',
  preparationEnd: '2026-12-25',
  draftingStart: '2026-12-26',
  draftingEnd: '2027-02-21',
  midtermStart: '2027-02-22',
  midtermEnd: '2027-04-02',
  refinementStart: '2027-04-03',
  refinementEnd: '2027-04-16',
  summaryStart: '2026-11-23',
  summaryEnd: '2027-04-16',
  thesisDeadline: '2027-04-21',
  formReviewSign: '2027-04-23',
  evaluationStart: '2027-04-24',
  evaluationEnd: '2027-05-07',
  defenseDate: '2027-05-08',
  similarityLimit: 30,
  aigcLimit: 40,
};

export type GraduationCalendar = typeof defaultCalendar;
export const GRADUATION_CALENDAR_KEY = 'graduationCalendars';

const stages = {
  PREPARATION: ['preparationStart', 'preparationEnd'],
  DRAFTING: ['draftingStart', 'draftingEnd'],
  MIDTERM_CHECK: ['midtermStart', 'midtermEnd'],
  REFINEMENT: ['refinementStart', 'refinementEnd'],
  SUMMARY: ['summaryStart', 'summaryEnd'],
} as const;

export function getStageDates(calendar: GraduationCalendar | null, type: keyof typeof stages) {
  const [start, end] = stages[type];
  return { start: calendar?.[start] ?? '', end: calendar?.[end] ?? '' };
}

function record(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null && !Array.isArray(value) ? value as Record<string, unknown> : null;
}

function isDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T00:00:00Z');
  return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isCalendar(value: unknown): value is GraduationCalendar {
  const calendar = record(value);
  if (!calendar) return false;
  const dateKeys = (Object.keys(defaultCalendar) as Array<keyof GraduationCalendar>)
    .filter(key => key !== 'similarityLimit' && key !== 'aigcLimit');
  if (!dateKeys.every(key => isDate(calendar[key]))) return false;
  const dates = calendar as unknown as GraduationCalendar;
  return [calendar.similarityLimit, calendar.aigcLimit].every(limit =>
    typeof limit === 'number' && Number.isFinite(limit) && limit > 0 && limit <= 100
  ) && [
    [dates.taskDeadline, dates.taskLeaderSign, dates.taskStudentAdvisorSign, dates.proposalDeadline],
    [dates.preparationStart, dates.preparationEnd, dates.draftingStart, dates.draftingEnd,
      dates.midtermStart, dates.midtermEnd, dates.refinementStart, dates.refinementEnd, dates.thesisDeadline,
      dates.formReviewSign, dates.evaluationStart, dates.evaluationEnd, dates.defenseDate],
    [dates.summaryStart, dates.summaryEnd],
  ].every(sequence => sequence.every((date, index) => index === 0 || date >= sequence[index - 1]));
}

function parseCalendars(content: string): Record<string, GraduationCalendar> | null {
  try {
    const parsed = record(JSON.parse(content));
    if (!parsed || !Object.entries(parsed).every(([year, calendar]) => /^20\d{2}$/.test(year) && isCalendar(calendar))) {
      return null;
    }
    return parsed as Record<string, GraduationCalendar>;
  } catch {
    return null;
  }
}

export const defaultGraduationCalendars = JSON.stringify({ '2027': defaultCalendar }, null, 2);

export function validateGraduationCalendars(value: unknown): string | null {
  return typeof value === 'string' && value.length <= 20000 && parseCalendars(value)
    ? null : '请输入有效的届别日历，日期使用 YYYY-MM-DD，并检查阶段顺序和检测阈值';
}

export async function loadGraduationCalendar(prisma: PrismaClient, cohort: string): Promise<GraduationCalendar | null> {
  const config = await prisma.systemConfig.findUnique({ where: { key: GRADUATION_CALENDAR_KEY }, select: { value: true } });
  return (config && parseCalendars(config.value)?.[cohort]) || (cohort === '2027' ? defaultCalendar : null);
}

const profileFields = {
  college: 100,
  englishTitle: 250,
  topicCode: 60,
  advisorName: 60,
  advisorTitle: 60,
  reviewerName: 60,
  reviewerTitle: 60,
  references: 6000,
} as const;

export type HandbookProfile = Record<keyof typeof profileFields, string> & {
  cohort: string;
  proposalDate: string;
  notes: Partial<Record<GraduationStage | 'SUMMARY', string>>;
};

export const defaultHandbookProfile: HandbookProfile = {
  cohort: '2027',
  college: '信息与计算机工程学院',
  englishTitle: '',
  topicCode: '',
  advisorName: '',
  advisorTitle: '',
  reviewerName: '',
  reviewerTitle: '',
  proposalDate: '',
  references: '',
  notes: {},
};

export function parseHandbookProfile(value: unknown): HandbookProfile | null {
  const input = record(value);
  if (!input) return null;
  const cohort = input.cohort ?? defaultHandbookProfile.cohort;
  const proposalDate = input.proposalDate ?? '';
  if (typeof cohort !== 'string' || !/^20\d{2}$/.test(cohort) || (proposalDate !== '' && !isDate(proposalDate))) {
    return null;
  }
  const profile = { ...defaultHandbookProfile, cohort, proposalDate, notes: {} } satisfies HandbookProfile;
  for (const key of Object.keys(profileFields) as Array<keyof typeof profileFields>) {
    const field = input[key] ?? profile[key];
    if (typeof field !== 'string' || field.length > profileFields[key]) return null;
    profile[key] = field.trim();
  }
  const notes = record(input.notes ?? {});
  if (!notes) return null;
  const result: HandbookProfile = profile;
  for (const key of [...GRADUATION_STAGES, 'SUMMARY'] as const) {
    const note = notes[key] ?? '';
    if (typeof note !== 'string' || note.length > 2500) return null;
    if (note.trim()) result.notes[key] = note.trim();
  }
  return result;
}

export function readHandbookProfile(content?: string): HandbookProfile {
  if (content) {
    try {
      const profile = parseHandbookProfile(JSON.parse(content));
      if (profile) return profile;
    } catch {
      // Material saved by an earlier version may not parse.
    }
  }
  return defaultHandbookProfile;
}

export function formatHandbookDate(date?: string): string {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return `${year} 年 ${Number(month)} 月 ${Number(day)} 日`;
}

export function formatHandbookRange(start?: string, end?: string): string {
  return start && end ? `自 ${formatHandbookDate(start)} 至 ${formatHandbookDate(end)}` : '';
}
