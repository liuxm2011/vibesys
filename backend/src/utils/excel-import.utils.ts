import * as XLSX from 'xlsx';

export interface TopicImportRow {
  title?: string;
  description?: string;
  background?: string;
  objectives?: string;
  domain?: string;
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

// ============================================================
// STUDENT IMPORT UTILITIES
// ============================================================

/**
 * Validate student ID format
 * Format: 231322083 (23=学院, 13=大数据专业/11=软件工程, 22=年级, 083=序号)
 */
export function validateStudentId(studentId: string): boolean {
  return /^23(11|13)\d{5}$/.test(studentId);
}

/**
 * Derive major from student ID
 * 11 -> 软件工程, 13 -> 大数据
 */
export function deriveMajorFromStudentId(studentId: string): string {
  const code = studentId.substring(2, 4);
  if (code === '11') return '软件工程';
  if (code === '13') return '大数据';
  throw new Error('无效的专业代码');
}

/**
 * Derive grade from student ID
 * Extract 5-6 position and convert to "20XX级"
 */
export function deriveGradeFromStudentId(studentId: string): string {
  const gradeCode = studentId.substring(4, 6);
  return `20${gradeCode}级`;
}

/**
 * Parse Excel buffer into student rows
 */
export function parseExcelStudents(buffer: Buffer): StudentImportRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[];

  // Skip header row (first row)
  const rows: StudentImportRow[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const studentId = row[0]?.toString().trim() || '';
    const name = row[1]?.toString().trim() || '';
    const classField = row[2]?.toString().trim() || '';

    // Skip empty rows (both studentId and name are empty)
    if (!studentId && !name) continue;

    rows.push({
      studentId,
      name,
      class: classField
    });
  }

  return rows;
}

/**
 * Validate a single student import row
 * Returns array of error messages, empty array means valid
 */
export function validateStudentRow(row: StudentImportRow, existingIds: Set<string>): string[] {
  const errors: string[] = [];

  // Check student ID
  if (!row.studentId) {
    errors.push('学号不能为空');
  } else if (!validateStudentId(row.studentId)) {
    errors.push('学号格式错误，应为2311xxxxx或2313xxxxx');
  } else if (existingIds.has(row.studentId)) {
    errors.push('学号已存在');
  }

  // Check name
  if (!row.name) {
    errors.push('姓名不能为空');
  } else if (row.name.length < 2 || row.name.length > 20) {
    errors.push('姓名长度需要在2-20字符之间');
  }

  return errors;
}

/**
 * Generate Excel template buffer for student import
 */
export function generateStudentTemplateBuffer(): Buffer {
  const workbook = XLSX.utils.book_new();

  // Header row
  const headers = ['学号', '姓名', '班级'];

  // Example data row
  const example = ['231322083', '张三', '2301'];

  const wsData = [headers, example];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 15 },  // 学号
    { wch: 15 },  // 姓名
    { wch: 10 }   // 班级
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '学生导入模板');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Parse Excel buffer into topic rows
 */
export function parseExcelTopics(buffer: Buffer): TopicImportRow[] {
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json<TopicImportRow>(worksheet, { header: 1 });

  // Skip header row (first row)
  const rows: TopicImportRow[] = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i] as any[];
    if (!row || row.length === 0) continue;

    rows.push({
      title: row[0]?.toString().trim() || '',
      description: row[1]?.toString().trim() || '',
      background: row[2]?.toString().trim() || '',
      objectives: row[3]?.toString().trim() || '',
      domain: row[4]?.toString().trim() || '',
      techStack: row[5]?.toString().trim() || ''
    });
  }

  return rows;
}

/**
 * Validate a single topic import row
 */
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

  return errors;
}

/**
 * Generate Excel template buffer for import
 */
export function generateTemplateBuffer(): Buffer {
  const workbook = XLSX.utils.book_new();

  // Header row
  const headers = ['标题', '描述', '背景', '目标', '领域(SE/BD)', '技术栈(逗号分隔)'];

  // Example data row
  const example = [
    '在线图书管理系统',
    '开发一个完整的在线图书管理平台，支持图书借阅、归还、查询等功能',
    '随着学校图书馆数字化建设，需要一个现代化的管理系统',
    '实现图书信息管理、借阅记录管理、用户管理等功能',
    'SE',
    'Vue, Node.js, MySQL, Element Plus'
  ];

  const wsData = [headers, example];
  const worksheet = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  worksheet['!cols'] = [
    { wch: 25 },  // 标题
    { wch: 50 },  // 描述
    { wch: 40 },  // 背景
    { wch: 40 },  // 目标
    { wch: 15 },  // 领域
    { wch: 35 }   // 技术栈
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, '选题导入模板');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}
