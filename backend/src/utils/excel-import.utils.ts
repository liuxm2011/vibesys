export interface TopicImportRow {
  title?: string;
  description?: string;
  background?: string;
  objectives?: string;
  domain?: string;
  platform?: string;
  techStack?: string;
}

export interface StudentImportRow {
  studentId?: string;
  name?: string;
  class?: string;
}

export interface ValidationError {
  row: number;
  reason: string;
}

const PLATFORM_NAME_MAP: Record<string, string> = {
  'Web App': 'WEB',
  'Web': 'WEB',
  'web': 'WEB',
  'iOS': 'IOS',
  'ios': 'IOS',
  'IOS': 'IOS',
  'Android': 'ANDROID',
  'android': 'ANDROID',
  '安卓': 'ANDROID',
  '微信小程序': 'WECHAT_MINI',
  '小程序': 'WECHAT_MINI',
  '微信': 'WECHAT_MINI',
  'Windows桌面端': 'WINDOWS_DESKTOP',
  'Windows': 'WINDOWS_DESKTOP',
  'windows': 'WINDOWS_DESKTOP',
  'Mac桌面端': 'MAC_DESKTOP',
  'Mac': 'MAC_DESKTOP',
  'mac': 'MAC_DESKTOP',
  'macOS': 'MAC_DESKTOP',
};

const VALID_PLATFORMS = new Set(['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP']);

async function getXLSX() {
  try {
    const XLSX = await import('xlsx');
    return XLSX;
  } catch {
    throw new Error('Excel功能在当前环境不可用，请使用Node.js环境');
  }
}

// ============================================================
// STUDENT IMPORT UTILITIES
// ============================================================

export function validateStudentId(studentId: string): boolean {
  return /^23(11|13)\d{5}$/.test(studentId);
}

export function deriveMajorFromStudentId(studentId: string): string {
  const code = studentId.substring(2, 4);
  if (code === '11') return '软件工程';
  if (code === '13') return '大数据';
  throw new Error('无效的专业代码');
}

export function deriveGradeFromStudentId(studentId: string): string {
  const gradeCode = studentId.substring(4, 6);
  return `20${gradeCode}级`;
}

export async function parseExcelStudents(buffer: Uint8Array | ArrayBuffer): Promise<StudentImportRow[]> {
  const XLSX = await getXLSX();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

  const rows: StudentImportRow[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const studentId = row[0]?.toString().trim() || '';
    const name = row[1]?.toString().trim() || '';
    const classField = row[2]?.toString().trim() || '';

    if (!studentId && !name) continue;

    rows.push({
      studentId,
      name,
      class: classField
    });
  }

  return rows;
}

export function validateStudentRow(row: StudentImportRow, existingIds: Set<string>): string[] {
  const errors: string[] = [];

  if (!row.studentId) {
    errors.push('学号不能为空');
  } else if (!validateStudentId(row.studentId)) {
    errors.push('学号格式错误，应为2311xxxxx或2313xxxxx');
  } else if (existingIds.has(row.studentId)) {
    errors.push('学号已存在');
  }

  if (!row.name) {
    errors.push('姓名不能为空');
  } else if (row.name.length < 2 || row.name.length > 20) {
    errors.push('姓名长度需要在2-20字符之间');
  }

  return errors;
}

export async function generateStudentTemplateBuffer(): Promise<Uint8Array> {
  const XLSX = await getXLSX();
  const workbook = XLSX.utils.book_new();

  const headers = ['学号', '姓名', '班级'];
  const example = ['231322083', '张三', '2301'];

  const wsData = [headers, example];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  worksheet['!cols'] = [
    { wch: 15 },
    { wch: 15 },
    { wch: 10 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '学生导入模板');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

export async function parseExcelTopics(buffer: Uint8Array | ArrayBuffer): Promise<TopicImportRow[]> {
  const XLSX = await getXLSX();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<TopicImportRow>(worksheet, { header: 1 });

  const rows: TopicImportRow[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i] as any[];
    if (!row || row.length === 0) continue;

    const platformDisplay = row[5]?.toString().trim() || '';
    const platform = PLATFORM_NAME_MAP[platformDisplay] || platformDisplay;

    rows.push({
      title: row[0]?.toString().trim() || '',
      description: row[1]?.toString().trim() || '',
      background: row[2]?.toString().trim() || '',
      objectives: row[3]?.toString().trim() || '',
      domain: row[4]?.toString().trim() || '',
      platform,
      techStack: row[6]?.toString().trim() || ''
    });
  }

  return rows;
}

export function validateTopicRow(row: TopicImportRow): string[] {
  const errors: string[] = [];

  if (!row.title || row.title.length < 2 || row.title.length > 100) {
    errors.push('标题长度需要在2-100字符之间');
  }

  if (!row.description || row.description.length < 10 || row.description.length > 500) {
    errors.push('描述长度需要在10-500字符之间');
  }

  if (!row.domain || (row.domain !== 'SE' && row.domain !== 'BD')) {
    errors.push('领域类型必须是SE或BD');
  }

  if (!row.platform || !VALID_PLATFORMS.has(row.platform)) {
    errors.push('运行平台必须是6个有效值之一（WEB/IOS/ANDROID/WECHAT_MINI/WINDOWS_DESKTOP/MAC_DESKTOP）');
  }

  return errors;
}

export async function generateTemplateBuffer(): Promise<Uint8Array> {
  const XLSX = await getXLSX();
  const workbook = XLSX.utils.book_new();

  const headers = ['标题', '描述', '背景', '目标', '领域(SE/BD)', '运行平台', '技术栈(逗号分隔)'];

  const example = [
    '在线图书管理系统',
    '开发一个完整的在线图书管理平台，支持图书借阅、归还、查询等功能',
    '随着学校图书馆数字化建设，需要一个现代化的管理系统',
    '实现图书信息管理、借阅记录管理、用户管理等功能',
    'SE',
    'Web App',
    'Vue, Node.js, MySQL, Element Plus'
  ];

  const wsData = [headers, example];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  worksheet['!cols'] = [
    { wch: 25 },
    { wch: 50 },
    { wch: 40 },
    { wch: 40 },
    { wch: 15 },
    { wch: 15 },
    { wch: 35 }
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '选题导入模板');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
