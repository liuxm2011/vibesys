import { Router, Request, Response } from 'express';
import multer from 'multer';
import { Role, Status, Domain, Platform, TopicType, ProjectStatus } from '@prisma/client';
import { prisma } from '../index.js';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.middleware.js';
import { parseExcelTopics, validateTopicRow, generateTemplateBuffer, parseExcelStudents, validateStudentRow, generateStudentTemplateBuffer, deriveMajorFromStudentId, deriveGradeFromStudentId, validateStudentId } from '../utils/excel-import.utils.js';
import {
  ADMIN_DEFAULT_PASSWORD,
  getPasswordDisplayInfo,
  hashPassword,
  validatePassword
} from '../utils/password.utils.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

function buildAttachmentHeader(asciiFilename: string, utf8Filename: string): string {
  return `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(utf8Filename)}`;
}

function getDefaultPasswordForUser(user: { role: Role; studentId: string }): string {
  return user.role === Role.ADMIN ? ADMIN_DEFAULT_PASSWORD : user.studentId;
}

async function ensureSystemConfigTableExists(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SystemConfig (
      id INT NOT NULL AUTO_INCREMENT,
      \`key\` VARCHAR(191) NOT NULL,
      value LONGTEXT NOT NULL,
      description VARCHAR(191) NULL,
      updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      UNIQUE INDEX SystemConfig_key_key (\`key\`),
      INDEX SystemConfig_key_idx (\`key\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `);
}

async function withSystemConfigTable<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (error?.code === 'P2021' && error?.meta?.modelName === 'SystemConfig') {
      await ensureSystemConfigTableExists();
      return operation();
    }

    throw error;
  }
}

// Apply auth and admin middleware to all admin routes
router.use(authMiddleware);
router.use(adminOnlyMiddleware);

// ============================================================
// USER MANAGEMENT
// ============================================================

/**
 * GET /api/admin/users
 * ADM-01: View user list with pagination, search, and filters
 */
router.get('/users', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const search = (req.query.search as string) || '';
    const role = req.query.role as Role | undefined;
    const status = req.query.status as Status | undefined;
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { studentId: { contains: search } },
        { name: { contains: search } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    if (status) {
      whereClause.status = status;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          studentId: true,
          name: true,
          major: true,
          grade: true,
          class: true,
          password: true,
          role: true,
          status: true,
          createdAt: true,
          _count: {
            select: { projects: true }
          }
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const formattedUsers = await Promise.all(
      users.map(async (u) => {
        const passwordInfo = await getPasswordDisplayInfo(u.studentId, u.role, u.password);

        return {
          id: u.id,
          studentId: u.studentId,
          name: u.name,
          major: u.major,
          grade: u.grade,
          class: u.class,
          role: u.role,
          status: u.status,
          projectCount: u._count.projects,
          createdAt: u.createdAt,
          passwordStatus: passwordInfo.passwordStatus,
          passwordHint: passwordInfo.passwordHint,
          revealedPassword: passwordInfo.revealedPassword,
          canRevealPassword: passwordInfo.canReveal
        };
      })
    );

    res.json({
      users: formattedUsers,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    res.status(500).json({ error: '获取用户列表失败' });
  }
});

/**
 * PUT /api/admin/users/:id/status
 * ADM-06: Ban/unban user
 */
router.put('/users/:id/status', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const userId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    const { status } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: '无效的用户ID' });
    }

    if (status !== Status.ACTIVE && status !== Status.BANNED) {
      return res.status(400).json({ error: '无效的状态值' });
    }

    // Prevent banning admin accounts
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    if (user.role === Role.ADMIN) {
      return res.status(400).json({ error: '不能封禁管理员账号' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status as Status },
      select: { id: true, status: true, name: true }
    });

    res.json({
      message: status === Status.BANNED ? '用户已封禁' : '用户已解封',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ error: '更新用户状态失败' });
  }
});

/**
 * GET /api/admin/users/:id/password
 * Returns password visibility info without exposing non-recoverable custom passwords
 */
router.get('/users/:id/password', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const userId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);

    if (isNaN(userId)) {
      return res.status(400).json({ error: '无效的用户ID' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true,
        password: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    const passwordInfo = await getPasswordDisplayInfo(user.studentId, user.role, user.password);

    res.json({
      userId: user.id,
      name: user.name,
      passwordStatus: passwordInfo.passwordStatus,
      passwordHint: passwordInfo.passwordHint,
      revealedPassword: passwordInfo.revealedPassword,
      canRevealPassword: passwordInfo.canReveal
    });
  } catch (error) {
    console.error('Get user password info error:', error);
    res.status(500).json({ error: '获取密码信息失败' });
  }
});

/**
 * PUT /api/admin/users/:id/password
 * Allows admin to reset password to default or set a custom password
 */
router.put('/users/:id/password', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const userId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    const { action, newPassword } = req.body as {
      action?: 'RESET_TO_DEFAULT' | 'SET_CUSTOM';
      newPassword?: string;
    };

    if (isNaN(userId)) {
      return res.status(400).json({ error: '无效的用户ID' });
    }

    if (action !== 'RESET_TO_DEFAULT' && action !== 'SET_CUSTOM') {
      return res.status(400).json({ error: '无效的密码操作类型' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        studentId: true,
        name: true,
        role: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    let passwordToApply = getDefaultPasswordForUser(user);

    if (action === 'SET_CUSTOM') {
      const validationError = validatePassword(newPassword || '');
      if (validationError) {
        return res.status(400).json({ error: validationError });
      }

      passwordToApply = newPassword!;
    }

    const hashedPassword = await hashPassword(passwordToApply);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    res.json({
      message: action === 'RESET_TO_DEFAULT' ? '密码已重置为默认值' : '密码修改成功',
      userId: user.id,
      passwordStatus: action === 'RESET_TO_DEFAULT' ? 'DEFAULT' : 'CUSTOM',
      passwordHint:
        action === 'RESET_TO_DEFAULT'
          ? user.role === Role.ADMIN
            ? '已重置为系统默认管理员密码'
            : '已重置为学号'
          : '已设置为管理员指定的新密码',
      revealedPassword: passwordToApply
    });
  } catch (error) {
    console.error('Update user password error:', error);
    res.status(500).json({ error: '更新密码失败' });
  }
});

/**
 * POST /api/admin/users
 * Create a single student
 */
router.post('/users', async (req: Request, res: Response) => {
  try {
    const { studentId, name, class: classField } = req.body;

    // Validate required fields
    if (!studentId || !name) {
      return res.status(400).json({ error: '学号和姓名为必填项' });
    }

    // Validate student ID format
    if (!validateStudentId(studentId)) {
      return res.status(400).json({ error: '学号格式错误，应为2311xxxxx或2313xxxxx' });
    }

    // Check if student ID already exists
    const existingUser = await prisma.user.findUnique({ where: { studentId } });
    if (existingUser) {
      return res.status(400).json({ error: '学号已存在' });
    }

    // Validate name length
    if (name.length < 2 || name.length > 20) {
      return res.status(400).json({ error: '姓名长度需要在2-20字符之间' });
    }

    // Derive major and grade from student ID
    const major = deriveMajorFromStudentId(studentId);
    const grade = deriveGradeFromStudentId(studentId);

    // Initial student password follows the project rule: password = studentId
    const hashedPassword = await hashPassword(studentId);

    // Create user
    const user = await prisma.user.create({
      data: {
        studentId,
        name,
        major,
        grade,
        class: classField || '',
        password: hashedPassword,
        role: Role.STUDENT,
        status: Status.ACTIVE
      },
      select: {
        id: true,
        studentId: true,
        name: true,
        major: true,
        grade: true,
        class: true,
        role: true,
        status: true,
        createdAt: true
      }
    });

    res.json({
      user,
      initialPassword: studentId
    });
  } catch (error) {
    console.error('Create student error:', error);
    res.status(500).json({ error: '创建学生失败' });
  }
});

/**
 * POST /api/admin/users/import
 * Batch import students from Excel file
 */
router.post('/users/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传Excel文件' });
    }

    const rows = parseExcelStudents(req.file.buffer);
    const errors: { row: number; reason: string }[] = [];
    let imported = 0;

    // Query existing student IDs for uniqueness check
    const existingUsers = await prisma.user.findMany({
      select: { studentId: true }
    });
    const existingIds = new Set(existingUsers.map(u => u.studentId));

    // Validate each row
    const validRows: any[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validationErrors = validateStudentRow(row, existingIds);

      if (validationErrors.length > 0) {
        errors.push({ row: i + 2, reason: validationErrors.join(', ') });
      } else {
        // Add to valid set for deduplication within import file
        existingIds.add(row.studentId!);

        validRows.push({
          studentId: row.studentId!,
          name: row.name!,
          major: deriveMajorFromStudentId(row.studentId!),
          grade: deriveGradeFromStudentId(row.studentId!),
          class: row.class || '',
          role: Role.STUDENT,
          status: Status.ACTIVE
        });
      }
    }

    // Hash passwords and create users
    if (validRows.length > 0) {
      const usersWithPassword = await Promise.all(
        validRows.map(async (row) => ({
          ...row,
          password: await hashPassword(row.studentId)
        }))
      );

      await prisma.user.createMany({ data: usersWithPassword });
      imported = validRows.length;
    }

    res.json({
      success: errors.length === 0,
      imported,
      failed: errors.length,
      errors,
      defaultPasswordRule: '初始密码默认为学生学号'
    });
  } catch (error) {
    console.error('Import students error:', error);
    res.status(500).json({ error: '导入学生失败' });
  }
});

/**
 * GET /api/admin/users/template
 * Download Excel import template for students
 */
router.get('/users/template', async (req: Request, res: Response) => {
  try {
    const buffer = generateStudentTemplateBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      buildAttachmentHeader('student-import-template.xlsx', '学生导入模板.xlsx')
    );
    res.send(buffer);
  } catch (error) {
    console.error('Generate student template error:', error);
    res.status(500).json({ error: '生成模板失败' });
  }
});

// ============================================================
// TOPIC MANAGEMENT
// ============================================================

/**
 * GET /api/admin/topics
 * ADM-02: View all topics with pagination and filters
 */
router.get('/topics', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const search = (req.query.search as string) || '';
    const domain = req.query.domain as Domain | undefined;
    const typeFilter = req.query.type as 'SYSTEM' | 'CUSTOM' | undefined;
    const platformFilter = req.query.platform as Platform | undefined;
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};

    // Apply type filter: SYSTEM = 内置, CUSTOM = 自拟, undefined = 全部
    if (typeFilter === 'SYSTEM') {
      whereClause.type = TopicType.SYSTEM;
    } else if (typeFilter === 'CUSTOM') {
      whereClause.type = TopicType.CUSTOM;
    }

    if (search) {
      whereClause.title = { contains: search };
    }

    if (domain) {
      whereClause.domain = domain;
    }

    if (platformFilter) {
      whereClause.platform = platformFilter;
    }

    const [topics, total] = await Promise.all([
      prisma.topic.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { projects: true }
          }
        }
      }),
      prisma.topic.count({ where: whereClause })
    ]);

    const formattedTopics = topics.map(t => ({
      ...t,
      techStack: t.techStack as string[]
    }));

    res.json({
      topics: formattedTopics,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Admin topics list error:', error);
    res.status(500).json({ error: '获取选题列表失败' });
  }
});

/**
 * POST /api/admin/topics
 * Create a new system topic
 */
router.post('/topics', async (req: Request, res: Response) => {
  try {
    const { title, description, background, objectives, domain, platform, techStack } = req.body;

    if (!title || !description || !domain || !platform) {
      return res.status(400).json({ error: '请填写必要信息' });
    }

    if (title.length < 2 || title.length > 100) {
      return res.status(400).json({ error: '标题长度需要在2-100字符之间' });
    }

    if (description.length < 10 || description.length > 500) {
      return res.status(400).json({ error: '描述长度需要在10-500字符之间' });
    }

    if (domain !== Domain.SE && domain !== Domain.BD) {
      return res.status(400).json({ error: '无效的领域类型' });
    }

    const validPlatforms = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: '无效的运行平台' });
    }

    const topic = await prisma.topic.create({
      data: {
        title,
        description,
        background: background || '',
        objectives: objectives || '',
        domain: domain as Domain,
        platform: platform as Platform,
        techStack: techStack || [],
        type: TopicType.SYSTEM
      }
    });

    res.json({ topic: { ...topic, techStack: topic.techStack as string[] } });
  } catch (error) {
    console.error('Create topic error:', error);
    res.status(500).json({ error: '创建选题失败' });
  }
});

/**
 * PUT /api/admin/topics/:id
 * Update an existing topic
 */
router.put('/topics/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const topicId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    if (isNaN(topicId)) {
      return res.status(400).json({ error: '无效的选题ID' });
    }

    const existingTopic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        type: TopicType.SYSTEM
      },
      select: { id: true }
    });

    if (!existingTopic) {
      return res.status(404).json({ error: '系统选题不存在' });
    }

    const { title, description, background, objectives, domain, platform, techStack } = req.body;

    if (!title || !description || !domain || !platform) {
      return res.status(400).json({ error: '请填写必要信息' });
    }

    if (title.length < 2 || title.length > 100) {
      return res.status(400).json({ error: '标题长度需要在2-100字符之间' });
    }

    if (description.length < 10 || description.length > 500) {
      return res.status(400).json({ error: '描述长度需要在10-500字符之间' });
    }

    if (domain !== Domain.SE && domain !== Domain.BD) {
      return res.status(400).json({ error: '无效的领域类型' });
    }

    const validPlatforms = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];
    if (!validPlatforms.includes(platform)) {
      return res.status(400).json({ error: '无效的运行平台' });
    }

    const topic = await prisma.topic.update({
      where: { id: topicId },
      data: {
        title,
        description,
        background: background || '',
        objectives: objectives || '',
        domain: domain as Domain,
        platform: platform as Platform,
        techStack: techStack || []
      }
    });

    res.json({ topic: { ...topic, techStack: topic.techStack as string[] } });
  } catch (error) {
    console.error('Update topic error:', error);
    res.status(500).json({ error: '更新选题失败' });
  }
});

/**
 * DELETE /api/admin/topics/:id
 * Delete a topic (only if not referenced by any project)
 */
router.delete('/topics/:id', async (req: Request, res: Response) => {
  try {
    const idParam = req.params.id;
    const topicId = parseInt(Array.isArray(idParam) ? idParam[0] : idParam);
    if (isNaN(topicId)) {
      return res.status(400).json({ error: '无效的选题ID' });
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        type: TopicType.SYSTEM
      },
      select: { id: true }
    });

    if (!topic) {
      return res.status(404).json({ error: '系统选题不存在' });
    }

    // Check if topic is referenced by any project
    const projectCount = await prisma.project.count({ where: { topicId } });
    if (projectCount > 0) {
      return res.status(400).json({ error: '该选题已被学生选择，无法删除' });
    }

    await prisma.topic.delete({ where: { id: topicId } });
    res.json({ message: '选题已删除' });
  } catch (error) {
    console.error('Delete topic error:', error);
    res.status(500).json({ error: '删除选题失败' });
  }
});

/**
 * POST /api/admin/topics/import
 * Batch import topics from Excel file
 */
router.post('/topics/import', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '请上传Excel文件' });
    }

    const rows = parseExcelTopics(req.file.buffer);
    const errors: { row: number; reason: string }[] = [];
    let imported = 0;

    const validRows: any[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validationErrors = validateTopicRow(row);

      if (validationErrors.length > 0) {
        errors.push({ row: i + 2, reason: validationErrors.join(', ') });
      } else {
        validRows.push({
          title: row.title!,
          description: row.description!,
          background: row.background || '',
          objectives: row.objectives || '',
          domain: row.domain! as Domain,
          platform: row.platform! as Platform,
          techStack: row.techStack ? row.techStack.split(',').map(s => s.trim()).filter(Boolean) : [],
          type: TopicType.SYSTEM
        });
      }
    }

    if (validRows.length > 0) {
      await prisma.topic.createMany({ data: validRows });
      imported = validRows.length;
    }

    res.json({
      success: errors.length === 0,
      imported,
      failed: errors.length,
      errors
    });
  } catch (error) {
    console.error('Import topics error:', error);
    res.status(500).json({ error: '导入选题失败' });
  }
});

/**
 * GET /api/admin/topics/template
 * Download Excel import template
 */
router.get('/topics/template', async (req: Request, res: Response) => {
  try {
    const buffer = generateTemplateBuffer();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      buildAttachmentHeader('topic-import-template.xlsx', '选题导入模板.xlsx')
    );
    res.send(buffer);
  } catch (error) {
    console.error('Generate template error:', error);
    res.status(500).json({ error: '生成模板失败' });
  }
});

// ============================================================
// STATISTICS
// ============================================================

/**
 * GET /api/admin/stats/overview
 * ADM-03: Overview statistics
 */
router.get('/stats/overview', async (req: Request, res: Response) => {
  try {
    const [
      totalUsers,
      activeUsers,
      bannedUsers,
      systemTopics,
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      totalDocuments
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { status: Status.ACTIVE } }),
      prisma.user.count({ where: { status: Status.BANNED } }),
      prisma.topic.count({ where: { type: TopicType.SYSTEM } }),
      prisma.project.count(),
      prisma.project.count({ where: { status: ProjectStatus.COMPLETED } }),
      prisma.project.count({ where: { status: ProjectStatus.IN_PROGRESS } }),
      prisma.project.count({ where: { status: ProjectStatus.NOT_STARTED } }),
      prisma.document.count()
    ]);

    res.json({
      totalUsers,
      activeUsers,
      bannedUsers,
      totalTopics: systemTopics,
      systemTopics,
      customTopics: 0,
      totalProjects,
      completedProjects,
      inProgressProjects,
      notStartedProjects,
      totalDocuments
    });
  } catch (error) {
    console.error('Overview stats error:', error);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

/**
 * GET /api/admin/stats/users
 * User statistics by major and grade
 */
router.get('/stats/users', async (req: Request, res: Response) => {
  try {
    const byMajor = await prisma.user.groupBy({
      by: ['major'],
      _count: true,
      orderBy: { _count: { major: 'desc' } }
    });

    const byGrade = await prisma.user.groupBy({
      by: ['grade'],
      _count: true,
      orderBy: { _count: { grade: 'desc' } }
    });

    // Recent registrations (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true
    });

    // Group by date
    const dateMap = new Map<string, number>();
    recentRegistrations.forEach(r => {
      const date = r.createdAt.toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + r._count);
    });

    const recentByDate = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    res.json({
      byMajor: byMajor.map(m => ({ major: m.major, count: m._count })),
      byGrade: byGrade.map(g => ({ grade: g.grade, count: g._count })),
      recentRegistrations: recentByDate
    });
  } catch (error) {
    console.error('User stats error:', error);
    res.status(500).json({ error: '获取用户统计失败' });
  }
});

/**
 * GET /api/admin/stats/projects
 * Project statistics by domain and status
 */
router.get('/stats/projects', async (req: Request, res: Response) => {
  try {
    // Projects by domain (via topic)
    const projects = await prisma.project.findMany({
      include: { topic: { select: { domain: true } } }
    });

    const domainMap = new Map<string, number>();
    projects.forEach(p => {
      const domain = p.topic.domain;
      domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
    });

    const byDomain = Array.from(domainMap.entries())
      .map(([domain, count]) => ({ domain, count }));

    // Projects by status
    const byStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: true
    });

    // Average projects per user
    const totalUsers = await prisma.user.count({ where: { role: Role.STUDENT } });
    const avgProjectsPerUser = totalUsers > 0 ? projects.length / totalUsers : 0;

    res.json({
      byDomain,
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
      avgProjectsPerUser: Math.round(avgProjectsPerUser * 100) / 100
    });
  } catch (error) {
    console.error('Project stats error:', error);
    res.status(500).json({ error: '获取项目统计失败' });
  }
});

// ============================================================
// SYSTEM CONFIG
// ============================================================

/**
 * GET /api/admin/config/announcement
 * ADM-04: Get announcement config
 */
router.get('/config/announcement', async (req: Request, res: Response) => {
  try {
    const config = await withSystemConfigTable(() =>
      prisma.systemConfig.findUnique({
        where: { key: 'announcement' }
      })
    );

    if (!config) {
      return res.json({ key: 'announcement', value: '', updatedAt: new Date() });
    }

    res.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({ error: '获取公告配置失败' });
  }
});

/**
 * PUT /api/admin/config/announcement
 * Update announcement config
 */
router.put('/config/announcement', async (req: Request, res: Response) => {
  try {
    const { value } = req.body;

    if (typeof value !== 'string') {
      return res.status(400).json({ error: '无效的配置值' });
    }

    if (value.length > 5000) {
      return res.status(400).json({ error: '公告内容不能超过5000字符' });
    }

    const config = await withSystemConfigTable(() =>
      prisma.systemConfig.upsert({
        where: { key: 'announcement' },
        update: { value },
        create: { key: 'announcement', value, description: '平台公告' }
      })
    );

    res.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({ error: '更新公告配置失败' });
  }
});

/**
 * GET /api/admin/config/guide
 * ADM-05: Get guide config
 */
router.get('/config/guide', async (req: Request, res: Response) => {
  try {
    const config = await withSystemConfigTable(() =>
      prisma.systemConfig.findUnique({
        where: { key: 'guide' }
      })
    );

    if (!config) {
      return res.json({ key: 'guide', value: '', updatedAt: new Date() });
    }

    res.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get guide error:', error);
    res.status(500).json({ error: '获取指南配置失败' });
  }
});

/**
 * PUT /api/admin/config/guide
 * Update guide config
 */
router.put('/config/guide', async (req: Request, res: Response) => {
  try {
    const { value } = req.body;

    if (typeof value !== 'string') {
      return res.status(400).json({ error: '无效的配置值' });
    }

    if (value.length > 10000) {
      return res.status(400).json({ error: '指南内容不能超过10000字符' });
    }

    const config = await withSystemConfigTable(() =>
      prisma.systemConfig.upsert({
        where: { key: 'guide' },
        update: { value },
        create: { key: 'guide', value, description: '使用指南' }
      })
    );

    res.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update guide error:', error);
    res.status(500).json({ error: '更新指南配置失败' });
  }
});

// ============================================================
// AI USAGE STATISTICS
// ============================================================

/**
 * GET /api/admin/stats/ai-usage
 * AI usage statistics: total requests, total tokens, per-user breakdown,
 * per-docType breakdown, daily trends, and failed requests
 */
router.get('/stats/ai-usage', async (req: Request, res: Response) => {
  try {
    // Overall totals
    const [
      totalRequests,
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      successRequests,
      errorRequests,
      timeoutRequests
    ] = await Promise.all([
      prisma.aiUsageLog.count(),
      prisma.aiUsageLog.aggregate({ _sum: { promptTokens: true } }),
      prisma.aiUsageLog.aggregate({ _sum: { completionTokens: true } }),
      prisma.aiUsageLog.aggregate({ _sum: { totalTokens: true } }),
      prisma.aiUsageLog.count({ where: { status: 'success' } }),
      prisma.aiUsageLog.count({ where: { status: 'error' } }),
      prisma.aiUsageLog.count({ where: { status: 'timeout' } })
    ]);

    // Per-user breakdown (top 50 by total tokens)
    const userUsageRaw = await prisma.aiUsageLog.groupBy({
      by: ['userId'],
      _count: true,
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true
      },
      orderBy: { _sum: { totalTokens: 'desc' } },
      take: 50
    });

    // Fetch user names for the breakdown
    const userIds = userUsageRaw.map(u => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, studentId: true }
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    const userUsage = userUsageRaw.map(u => {
      const user = userMap.get(u.userId);
      return {
        userId: u.userId,
        name: user?.name || '未知用户',
        studentId: user?.studentId || '-',
        requestCount: u._count,
        promptTokens: u._sum.promptTokens || 0,
        completionTokens: u._sum.completionTokens || 0,
        totalTokens: u._sum.totalTokens || 0
      };
    });

    // Per-docType breakdown
    const docTypeUsageRaw = await prisma.aiUsageLog.groupBy({
      by: ['docType'],
      _count: true,
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true
      },
      orderBy: { _sum: { totalTokens: 'desc' } }
    });

    const docTypeUsage = docTypeUsageRaw.map(d => ({
      docType: d.docType || 'unknown',
      requestCount: d._count,
      promptTokens: d._sum.promptTokens || 0,
      completionTokens: d._sum.completionTokens || 0,
      totalTokens: d._sum.totalTokens || 0
    }));

    // Per-operation breakdown
    const operationUsageRaw = await prisma.aiUsageLog.groupBy({
      by: ['operation'],
      _count: true,
      _sum: {
        promptTokens: true,
        completionTokens: true,
        totalTokens: true
      },
      orderBy: { _sum: { totalTokens: 'desc' } }
    });

    const operationUsage = operationUsageRaw.map(o => ({
      operation: o.operation,
      requestCount: o._count,
      promptTokens: o._sum.promptTokens || 0,
      completionTokens: o._sum.completionTokens || 0,
      totalTokens: o._sum.totalTokens || 0
    }));

    // Daily trends (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const dailyLogs = await prisma.aiUsageLog.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: {
        createdAt: true,
        totalTokens: true,
        status: true
      }
    });

    const dateMap = new Map<string, { date: string; requestCount: number; totalTokens: number; successCount: number; errorCount: number; timeoutCount: number }>();
    for (const log of dailyLogs) {
      const date = log.createdAt.toISOString().split('T')[0];
      const entry = dateMap.get(date) || { date, requestCount: 0, totalTokens: 0, successCount: 0, errorCount: 0, timeoutCount: 0 };
      entry.requestCount += 1;
      entry.totalTokens += log.totalTokens;
      if (log.status === 'success') entry.successCount += 1;
      else if (log.status === 'error') entry.errorCount += 1;
      else if (log.status === 'timeout') entry.timeoutCount += 1;
      dateMap.set(date, entry);
    }

    const dailyTrends = Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));

    // Recent failed requests (last 50)
    const recentFailed = await prisma.aiUsageLog.findMany({
      where: { status: { in: ['error', 'timeout'] } },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        id: true,
        userId: true,
        projectId: true,
        docType: true,
        operation: true,
        status: true,
        errorMessage: true,
        createdAt: true
      }
    });

    const failedUserIds = recentFailed.map(f => f.userId);
    const failedUsers = await prisma.user.findMany({
      where: { id: { in: failedUserIds } },
      select: { id: true, name: true, studentId: true }
    });
    const failedUserMap = new Map(failedUsers.map(u => [u.id, u]));

    const recentFailedRequests = recentFailed.map(f => ({
      id: f.id,
      userId: f.userId,
      name: failedUserMap.get(f.userId)?.name || '未知用户',
      studentId: failedUserMap.get(f.userId)?.studentId || '-',
      projectId: f.projectId,
      docType: f.docType,
      operation: f.operation,
      status: f.status,
      errorMessage: f.errorMessage,
      createdAt: f.createdAt.toISOString()
    }));

    res.json({
      overview: {
        totalRequests,
        totalPromptTokens: totalPromptTokens._sum.promptTokens || 0,
        totalCompletionTokens: totalCompletionTokens._sum.completionTokens || 0,
        totalTokens: totalTokens._sum.totalTokens || 0,
        successRequests,
        errorRequests,
        timeoutRequests
      },
      userUsage,
      docTypeUsage,
      operationUsage,
      dailyTrends,
      recentFailedRequests
    });
  } catch (error) {
    console.error('AI usage stats error:', error);
    res.status(500).json({ error: '获取AI用量统计失败' });
  }
});

export default router;
