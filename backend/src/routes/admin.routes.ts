import { Hono } from 'hono';
import { Role, Status, Domain, Platform, TopicType, ProjectStatus } from '../generated/prisma';
import { authMiddleware, adminOnlyMiddleware } from '../middleware/auth.middleware.js';
import { parseExcelTopics, validateTopicRow, generateTemplateBuffer, parseExcelStudents, validateStudentRow, generateStudentTemplateBuffer, deriveMajorFromStudentId, deriveGradeFromStudentId, validateStudentId } from '../utils/excel-import.utils.js';
import {
  ADMIN_DEFAULT_PASSWORD,
  getPasswordDisplayInfo,
  hashPassword,
  validatePassword
} from '../utils/password.utils.js';
import { apiProviderService } from '../services/apiProvider.service.js';
import { getAllProjectRepos, adminUpdateDeployUrl } from '../services/repo.service.js';
import type { AppEnv } from '../types.js';

const router = new Hono<AppEnv>();

function buildAttachmentHeader(asciiFilename: string, utf8Filename: string): string {
  return `attachment; filename="${asciiFilename}"; filename*=UTF-8''${encodeURIComponent(utf8Filename)}`;
}

function getDefaultPasswordForUser(user: { role: Role; studentId: string }): string {
  return user.role === Role.ADMIN ? ADMIN_DEFAULT_PASSWORD : user.studentId;
}

router.use('*', authMiddleware);
router.use('*', adminOnlyMiddleware);

// ============================================================
// USER MANAGEMENT
// ============================================================

router.get('/users', async (c) => {
  try {
    const prisma = c.get('prisma');
    const q = c.req.query();
    const page = parseInt(q.page || '') || 1;
    const pageSize = parseInt(q.pageSize || '') || 20;
    const search = q.search || '';
    const role = q.role as Role | undefined;
    const major = q.major || '';
    const status = q.status as Status | undefined;
    const sortBy = q.sortBy || '';
    const sortOrder: 'asc' | 'desc' = q.sortOrder === 'asc' ? 'asc' : 'desc';
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

    if (major) {
      whereClause.role = Role.STUDENT;
      whereClause.major = major;
    }

    if (status) {
      whereClause.status = status;
    }

    const orderBy = sortBy === 'projectCount'
      ? { projects: { _count: sortOrder } }
      : { createdAt: 'desc' as const };

    const [users, total, majors] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy,
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
      prisma.user.count({ where: whereClause }),
      prisma.user.findMany({
        where: {
          role: Role.STUDENT,
          major: { not: '' }
        },
        distinct: ['major'],
        orderBy: { major: 'asc' },
        select: { major: true }
      })
    ]);

    const formattedUsers = await Promise.all(
      users.map(async (u: any) => {
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

    return c.json({
      users: formattedUsers,
      majors: majors.map((item: any) => item.major),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Admin users list error:', error);
    return c.json({ error: '获取用户列表失败' }, 500);
  }
});

router.put('/users/:id/status', async (c) => {
  try {
    const prisma = c.get('prisma');
    const userId = parseInt(c.req.param('id'));
    const { status } = await c.req.json();

    if (isNaN(userId)) {
      return c.json({ error: '无效的用户ID' }, 400);
    }

    if (status !== Status.ACTIVE && status !== Status.BANNED) {
      return c.json({ error: '无效的状态值' }, 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return c.json({ error: '用户不存在' }, 404);
    }

    if (user.role === Role.ADMIN) {
      return c.json({ error: '不能封禁管理员账号' }, 400);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: status as Status },
      select: { id: true, status: true, name: true }
    });

    return c.json({
      message: status === Status.BANNED ? '用户已封禁' : '用户已解封',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user status error:', error);
    return c.json({ error: '更新用户状态失败' }, 500);
  }
});

router.get('/users/:id/password', async (c) => {
  try {
    const prisma = c.get('prisma');
    const userId = parseInt(c.req.param('id'));

    if (isNaN(userId)) {
      return c.json({ error: '无效的用户ID' }, 400);
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
      return c.json({ error: '用户不存在' }, 404);
    }

    const passwordInfo = await getPasswordDisplayInfo(user.studentId, user.role, user.password);

    return c.json({
      userId: user.id,
      name: user.name,
      passwordStatus: passwordInfo.passwordStatus,
      passwordHint: passwordInfo.passwordHint,
      revealedPassword: passwordInfo.revealedPassword,
      canRevealPassword: passwordInfo.canReveal
    });
  } catch (error) {
    console.error('Get user password info error:', error);
    return c.json({ error: '获取密码信息失败' }, 500);
  }
});

router.put('/users/:id/password', async (c) => {
  try {
    const prisma = c.get('prisma');
    const userId = parseInt(c.req.param('id'));
    const { action, newPassword } = await c.req.json() as {
      action?: 'RESET_TO_DEFAULT' | 'SET_CUSTOM';
      newPassword?: string;
    };

    if (isNaN(userId)) {
      return c.json({ error: '无效的用户ID' }, 400);
    }

    if (action !== 'RESET_TO_DEFAULT' && action !== 'SET_CUSTOM') {
      return c.json({ error: '无效的操作类型' }, 400);
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
      return c.json({ error: '用户不存在' }, 404);
    }

    let passwordToApply = getDefaultPasswordForUser(user);

    if (action === 'SET_CUSTOM') {
      const validationError = validatePassword(newPassword || '');
      if (validationError) {
        return c.json({ error: validationError }, 400);
      }

      passwordToApply = newPassword!;
    }

    const hashedPassword = await hashPassword(passwordToApply);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    return c.json({
      message: action === 'RESET_TO_DEFAULT' ? '密码已重置为默认值' : '密码已设为自定义',
      userId: user.id,
      passwordStatus: action === 'RESET_TO_DEFAULT' ? 'DEFAULT' : 'CUSTOM',
      passwordHint:
        action === 'RESET_TO_DEFAULT'
          ? user.role === Role.ADMIN
            ? '已重置为管理员默认密码'
            : '已重置为学号'
          : '已设为自定义密码，请通知用户重新设置',
      revealedPassword: passwordToApply
    });
  } catch (error) {
    console.error('Update user password error:', error);
    return c.json({ error: '更新密码失败' }, 500);
  }
});

router.post('/users', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { studentId, name, class: classField } = await c.req.json();

    if (!studentId || !name) {
      return c.json({ error: '学号和姓名不能为空' }, 400);
    }

    if (!validateStudentId(studentId)) {
      return c.json({ error: '学号格式错误，应为2311xxxxx或2313xxxxx' }, 400);
    }

    const existingUser = await prisma.user.findUnique({ where: { studentId } });
    if (existingUser) {
      return c.json({ error: '学号已存在' }, 400);
    }

    if (name.length < 2 || name.length > 20) {
      return c.json({ error: '姓名长度需要在2-20字符之间' }, 400);
    }

    const major = deriveMajorFromStudentId(studentId);
    const grade = deriveGradeFromStudentId(studentId);

    const hashedPassword = await hashPassword(studentId);

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

    return c.json({
      user,
      initialPassword: studentId
    });
  } catch (error) {
    console.error('Create student error:', error);
    return c.json({ error: '创建学生失败' }, 500);
  }
});

router.post('/users/import', async (c) => {
  try {
    const prisma = c.get('prisma');
    const formData = await c.req.parseBody();
    const file = formData['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: '请上传 Excel 文件' }, 400);
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const rows = await parseExcelStudents(buffer);
    const errors: { row: number; reason: string }[] = [];
    let imported = 0;

    const existingUsers = await prisma.user.findMany({
      select: { studentId: true }
    });
    const existingIds = new Set(existingUsers.map((u: any) => u.studentId));

    const validRows: any[] = [];
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const validationErrors = validateStudentRow(row, existingIds);

      if (validationErrors.length > 0) {
        errors.push({ row: i + 2, reason: validationErrors.join(', ') });
      } else {
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

    return c.json({
      success: errors.length === 0,
      imported,
      failed: errors.length,
      errors,
      defaultPasswordRule: '初始密码为学号'
    });
  } catch (error) {
    console.error('Import students error:', error);
    return c.json({ error: '导入学生失败' }, 500);
  }
});

router.get('/users/template', async (c) => {
  try {
    const buffer = await generateStudentTemplateBuffer();
    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    c.header(
      'Content-Disposition',
      buildAttachmentHeader('student-import-template.xlsx', '学生导入模板.xlsx')
    );
    return c.body(buffer as any);
  } catch (error) {
    console.error('Generate student template error:', error);
    return c.json({ error: '生成模板失败' }, 500);
  }
});

// ============================================================
// TOPIC MANAGEMENT
// ============================================================

router.get('/topics', async (c) => {
  try {
    const prisma = c.get('prisma');
    const q = c.req.query();
    const page = parseInt(q.page || '') || 1;
    const pageSize = parseInt(q.pageSize || '') || 20;
    const search = q.search || '';
    const domain = q.domain as Domain | undefined;
    const typeFilter = q.type as 'SYSTEM' | 'CUSTOM' | undefined;
    const platformFilter = q.platform as Platform | undefined;
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};

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

    const formattedTopics = topics.map((t: any) => ({
      ...t,
      techStack: t.techStack as string[]
    }));

    return c.json({
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
    return c.json({ error: '获取选题列表失败' }, 500);
  }
});

router.post('/topics', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { title, description, background, objectives, domain, platform, techStack } = await c.req.json();

    if (!title || !description || !domain || !platform) {
      return c.json({ error: '请填写必要信息' }, 400);
    }

    if (title.length < 2 || title.length > 100) {
      return c.json({ error: '标题长度需要在2-100字符之间' }, 400);
    }

    if (description.length < 10 || description.length > 500) {
      return c.json({ error: '描述长度需要在10-500字符之间' }, 400);
    }

    if (domain !== Domain.SE && domain !== Domain.BD) {
      return c.json({ error: '无效的领域类型' }, 400);
    }

    const validPlatforms = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];
    if (!validPlatforms.includes(platform)) {
      return c.json({ error: '无效的运行平台' }, 400);
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

    return c.json({ topic: { ...topic, techStack: topic.techStack as string[] } });
  } catch (error) {
    console.error('Create topic error:', error);
    return c.json({ error: '创建选题失败' }, 500);
  }
});

router.put('/topics/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const topicId = parseInt(c.req.param('id'));
    if (isNaN(topicId)) {
      return c.json({ error: '无效的选题ID' }, 400);
    }

    const existingTopic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        type: TopicType.SYSTEM
      },
      select: { id: true }
    });

    if (!existingTopic) {
      return c.json({ error: '系统选题不存在' }, 404);
    }

    const { title, description, background, objectives, domain, platform, techStack } = await c.req.json();

    if (!title || !description || !domain || !platform) {
      return c.json({ error: '请填写必要信息' }, 400);
    }

    if (title.length < 2 || title.length > 100) {
      return c.json({ error: '标题长度需要在2-100字符之间' }, 400);
    }

    if (description.length < 10 || description.length > 500) {
      return c.json({ error: '描述长度需要在10-500字符之间' }, 400);
    }

    if (domain !== Domain.SE && domain !== Domain.BD) {
      return c.json({ error: '无效的领域类型' }, 400);
    }

    const validPlatforms = ['WEB', 'IOS', 'ANDROID', 'WECHAT_MINI', 'WINDOWS_DESKTOP', 'MAC_DESKTOP'];
    if (!validPlatforms.includes(platform)) {
      return c.json({ error: '无效的运行平台' }, 400);
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

    return c.json({ topic: { ...topic, techStack: topic.techStack as string[] } });
  } catch (error) {
    console.error('Update topic error:', error);
    return c.json({ error: '更新选题失败' }, 500);
  }
});

router.delete('/topics/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const topicId = parseInt(c.req.param('id'));
    if (isNaN(topicId)) {
      return c.json({ error: '无效的选题ID' }, 400);
    }

    const topic = await prisma.topic.findFirst({
      where: {
        id: topicId,
        type: TopicType.SYSTEM
      },
      select: { id: true }
    });

    if (!topic) {
      return c.json({ error: '系统选题不存在' }, 404);
    }

    const projectCount = await prisma.project.count({ where: { topicId } });
    if (projectCount > 0) {
      return c.json({ error: '该选题已被学生选择，无法删除' }, 400);
    }

    await prisma.topic.delete({ where: { id: topicId } });
    return c.json({ message: '选题已删除' });
  } catch (error) {
    console.error('Delete topic error:', error);
    return c.json({ error: '删除选题失败' }, 500);
  }
});

router.post('/topics/import', async (c) => {
  try {
    const prisma = c.get('prisma');
    const formData = await c.req.parseBody();
    const file = formData['file'];

    if (!file || !(file instanceof File)) {
      return c.json({ error: '请上传 Excel 文件' }, 400);
    }

    const buffer = new Uint8Array(await file.arrayBuffer());
    const rows = await parseExcelTopics(buffer);
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
          techStack: row.techStack ? row.techStack.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
          type: TopicType.SYSTEM
        });
      }
    }

    if (validRows.length > 0) {
      await prisma.topic.createMany({ data: validRows });
      imported = validRows.length;
    }

    return c.json({
      success: errors.length === 0,
      imported,
      failed: errors.length,
      errors
    });
  } catch (error) {
    console.error('Import topics error:', error);
    return c.json({ error: '导入选题失败' }, 500);
  }
});

router.get('/topics/template', async (c) => {
  try {
    const buffer = await generateTemplateBuffer();
    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    c.header(
      'Content-Disposition',
      buildAttachmentHeader('topic-import-template.xlsx', '选题导入模板.xlsx')
    );
    return c.body(buffer as any);
  } catch (error) {
    console.error('Generate template error:', error);
    return c.json({ error: '生成模板失败' }, 500);
  }
});

// ============================================================
// STATISTICS
// ============================================================

router.get('/stats/overview', async (c) => {
  try {
    const prisma = c.get('prisma');
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

    return c.json({
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
    return c.json({ error: '获取概览统计失败' }, 500);
  }
});

router.get('/stats/users', async (c) => {
  try {
    const prisma = c.get('prisma');
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

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentRegistrations = await prisma.user.groupBy({
      by: ['createdAt'],
      where: { createdAt: { gte: thirtyDaysAgo } },
      _count: true
    });

    const dateMap = new Map<string, number>();
    recentRegistrations.forEach((r: any) => {
      const date = r.createdAt.toISOString().split('T')[0];
      dateMap.set(date, (dateMap.get(date) || 0) + r._count);
    });

    const recentByDate = Array.from(dateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return c.json({
      byMajor: byMajor.map((m: any) => ({ major: m.major, count: m._count })),
      byGrade: byGrade.map((g: any) => ({ grade: g.grade, count: g._count })),
      recentRegistrations: recentByDate
    });
  } catch (error) {
    console.error('User stats error:', error);
    return c.json({ error: '获取用户统计失败' }, 500);
  }
});

router.get('/stats/projects', async (c) => {
  try {
    const prisma = c.get('prisma');
    const projects = await prisma.project.findMany({
      include: { topic: { select: { domain: true } } }
    });

    const domainMap = new Map<string, number>();
    projects.forEach((p: any) => {
      const domain = p.topic.domain;
      domainMap.set(domain, (domainMap.get(domain) || 0) + 1);
    });

    const byDomain = Array.from(domainMap.entries())
      .map(([domain, count]) => ({ domain, count }));

    const byStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: true
    });

    const totalUsers = await prisma.user.count({ where: { role: Role.STUDENT } });
    const avgProjectsPerUser = totalUsers > 0 ? projects.length / totalUsers : 0;

    return c.json({
      byDomain,
      byStatus: byStatus.map((s: any) => ({ status: s.status, count: s._count })),
      avgProjectsPerUser: Math.round(avgProjectsPerUser * 100) / 100
    });
  } catch (error) {
    console.error('Project stats error:', error);
    return c.json({ error: '获取项目统计失败' }, 500);
  }
});

// ============================================================
// SYSTEM CONFIG
// ============================================================

router.get('/config/announcement', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'announcement' }
    });

    if (!config) {
      return c.json({ key: 'announcement', value: '', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get announcement error:', error);
    return c.json({ error: '获取公告信息失败' }, 500);
  }
});

router.put('/config/announcement', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (typeof value !== 'string') {
      return c.json({ error: '无效的配置值' }, 400);
    }

    if (value.length > 5000) {
      return c.json({ error: '公告内容不能超过5000字符' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'announcement' },
      update: { value },
      create: { key: 'announcement', value, description: '平台公告' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update announcement error:', error);
    return c.json({ error: '更新公告信息失败' }, 500);
  }
});

router.get('/config/guide', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'guide' }
    });

    if (!config) {
      return c.json({ key: 'guide', value: '', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get guide error:', error);
    return c.json({ error: '获取指南信息失败' }, 500);
  }
});

router.put('/config/guide', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (typeof value !== 'string') {
      return c.json({ error: '无效的配置值' }, 400);
    }

    if (value.length > 10000) {
      return c.json({ error: '指南内容不能超过10000字符' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'guide' },
      update: { value },
      create: { key: 'guide', value, description: '使用指南' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update guide error:', error);
    return c.json({ error: '更新指南信息失败' }, 500);
  }
});

// ============================================================
// GRADUATION CONFIG
// ============================================================

router.get('/config/graduationEnabled', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'graduationEnabled' }
    });

    if (!config) {
      return c.json({ key: 'graduationEnabled', value: 'false', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get graduationEnabled error:', error);
    return c.json({ error: '获取毕业设计开关状态失败' }, 500);
  }
});

router.put('/config/graduationEnabled', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (value !== 'true' && value !== 'false') {
      return c.json({ error: '值必须为 true 或 false' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'graduationEnabled' },
      update: { value },
      create: { key: 'graduationEnabled', value, description: '毕业设计选题开关' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update graduationEnabled error:', error);
    return c.json({ error: '更新毕业设计开关状态失败' }, 500);
  }
});

router.get('/config/graduationWhitelist', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await prisma.systemConfig.findUnique({
      where: { key: 'graduationWhitelist' }
    });

    if (!config) {
      return c.json({ key: 'graduationWhitelist', value: '231311111', updatedAt: new Date() });
    }

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Get graduationWhitelist error:', error);
    return c.json({ error: '获取毕业设计白名单失败' }, 500);
  }
});

router.put('/config/graduationWhitelist', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { value } = await c.req.json();

    if (typeof value !== 'string') {
      return c.json({ error: '无效的白名单值' }, 400);
    }

    const config = await prisma.systemConfig.upsert({
      where: { key: 'graduationWhitelist' },
      update: { value },
      create: { key: 'graduationWhitelist', value, description: '毕业设计白名单（逗号分隔学号）' }
    });

    return c.json({ key: config.key, value: config.value, updatedAt: config.updatedAt });
  } catch (error) {
    console.error('Update graduationWhitelist error:', error);
    return c.json({ error: '更新毕业设计白名单失败' }, 500);
  }
});

// ============================================================
// AI USAGE STATISTICS
// ============================================================

router.get('/stats/ai-usage', async (c) => {
  try {
    const prisma = c.get('prisma');

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

    const userIds = userUsageRaw.map((u: any) => u.userId);
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, studentId: true }
    });
    const userMap = new Map(users.map((u: any) => [u.id, u]));

    const userUsage = userUsageRaw.map((u: any) => {
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

    const docTypeUsage = docTypeUsageRaw.map((d: any) => ({
      docType: d.docType || 'unknown',
      requestCount: d._count,
      promptTokens: d._sum.promptTokens || 0,
      completionTokens: d._sum.completionTokens || 0,
      totalTokens: d._sum.totalTokens || 0
    }));

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

    const operationUsage = operationUsageRaw.map((o: any) => ({
      operation: o.operation,
      requestCount: o._count,
      promptTokens: o._sum.promptTokens || 0,
      completionTokens: o._sum.completionTokens || 0,
      totalTokens: o._sum.totalTokens || 0
    }));

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
      const date = (log as any).createdAt.toISOString().split('T')[0];
      const entry = dateMap.get(date) || { date, requestCount: 0, totalTokens: 0, successCount: 0, errorCount: 0, timeoutCount: 0 };
      entry.requestCount += 1;
      entry.totalTokens += (log as any).totalTokens;
      if ((log as any).status === 'success') entry.successCount += 1;
      else if ((log as any).status === 'error') entry.errorCount += 1;
      else if ((log as any).status === 'timeout') entry.timeoutCount += 1;
      dateMap.set(date, entry);
    }

    const dailyTrends = Array.from(dateMap.values())
      .sort((a, b) => a.date.localeCompare(b.date));

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

    const failedUserIds = recentFailed.map((f: any) => f.userId);
    const failedUsers = await prisma.user.findMany({
      where: { id: { in: failedUserIds } },
      select: { id: true, name: true, studentId: true }
    });
    const failedUserMap = new Map(failedUsers.map((u: any) => [u.id, u]));

    const recentFailedRequests = recentFailed.map((f: any) => ({
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

    return c.json({
      overview: {
        totalRequests,
        totalPromptTokens: (totalPromptTokens as any)._sum.promptTokens || 0,
        totalCompletionTokens: (totalCompletionTokens as any)._sum.completionTokens || 0,
        totalTokens: (totalTokens as any)._sum.totalTokens || 0,
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
    return c.json({ error: '获取AI使用统计失败' }, 500);
  }
});

// ============================================================
// API PROVIDER MANAGEMENT
// ============================================================

router.get('/api-providers', async (c) => {
  try {
    const prisma = c.get('prisma');
    const providers = await apiProviderService.getAllProviders(prisma);
    const masked = providers.map((p: any) => ({
      ...p,
      apiKey: p.apiKey ? `${p.apiKey.slice(0, 8)}...` : '',
    }));
    return c.json({ providers: masked });
  } catch (error) {
    console.error('List API providers error:', error);
    return c.json({ error: '获取API提供商列表失败' }, 500);
  }
});

router.post('/api-providers', async (c) => {
  try {
    const prisma = c.get('prisma');
    const { name, providerType, baseURL, apiKey, model, description, isActive } = await c.req.json();

    if (!name || !providerType || !baseURL || !apiKey || !model) {
      return c.json({ error: '名称、类型、BaseURL、API密钥和模型不能为空' }, 400);
    }

    if (providerType !== 'minimax' && providerType !== 'openai_compatible') {
      return c.json({ error: '提供商类型必须为 minimax 或 openai_compatible' }, 400);
    }

    const provider = await apiProviderService.createProvider(prisma, {
      name,
      providerType,
      baseURL,
      apiKey,
      model,
      description,
      isActive: !!isActive,
    });

    return c.json({
      provider: {
        ...provider,
        apiKey: provider.apiKey ? `${provider.apiKey.slice(0, 8)}...` : '',
      },
      message: 'API提供商已创建'
    });
  } catch (error) {
    console.error('Create API provider error:', error);
    return c.json({ error: '创建API提供商失败' }, 500);
  }
});

router.put('/api-providers/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的提供商ID' }, 400);
    }

    const existing = await apiProviderService.getProviderById(prisma, id);
    if (!existing) {
      return c.json({ error: 'API提供商不存在' }, 404);
    }

    const { name, providerType, baseURL, apiKey, model, description, isActive } = await c.req.json();

    if (providerType && providerType !== 'minimax' && providerType !== 'openai_compatible') {
      return c.json({ error: '提供商类型必须为 minimax 或 openai_compatible' }, 400);
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (providerType !== undefined) updateData.providerType = providerType;
    if (baseURL !== undefined) updateData.baseURL = baseURL;
    if (apiKey !== undefined) updateData.apiKey = apiKey;
    if (model !== undefined) updateData.model = model;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = !!isActive;

    const provider = await apiProviderService.updateProvider(prisma, id, updateData);

    return c.json({
      provider: {
        ...provider,
        apiKey: provider.apiKey ? `${provider.apiKey.slice(0, 8)}...` : '',
      },
      message: 'API提供商已更新'
    });
  } catch (error) {
    console.error('Update API provider error:', error);
    return c.json({ error: '更新API提供商失败' }, 500);
  }
});

router.delete('/api-providers/:id', async (c) => {
  try {
    const prisma = c.get('prisma');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的提供商ID' }, 400);
    }

    const existing = await apiProviderService.getProviderById(prisma, id);
    if (!existing) {
      return c.json({ error: 'API提供商不存在' }, 404);
    }

    await apiProviderService.deleteProvider(prisma, id);
    return c.json({ message: 'API提供商已删除' });
  } catch (error) {
    console.error('Delete API provider error:', error);
    return c.json({ error: '删除API提供商失败' }, 500);
  }
});

router.post('/api-providers/:id/activate', async (c) => {
  try {
    const prisma = c.get('prisma');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的提供商ID' }, 400);
    }

    const existing = await apiProviderService.getProviderById(prisma, id);
    if (!existing) {
      return c.json({ error: 'API提供商不存在' }, 404);
    }

    const provider = await apiProviderService.setActiveProvider(prisma, id);

    return c.json({
      provider: {
        ...provider,
        apiKey: provider.apiKey ? `${provider.apiKey.slice(0, 8)}...` : '',
      },
      message: '已激活: ' + provider.name
    });
  } catch (error) {
    console.error('Activate API provider error:', error);
    return c.json({ error: '激活API提供商失败' }, 500);
  }
});

router.post('/api-providers/:id/test', async (c) => {
  try {
    const prisma = c.get('prisma');
    const id = parseInt(c.req.param('id'));
    if (isNaN(id)) {
      return c.json({ error: '无效的提供商ID' }, 400);
    }

    const result = await apiProviderService.testProviderConnection(prisma, id);
    return c.json(result);
  } catch (error) {
    console.error('Test API provider error:', error);
    return c.json({ error: '测试失败' }, 500);
  }
});

router.get('/api-providers/active', async (c) => {
  try {
    const prisma = c.get('prisma');
    const config = await apiProviderService.getEffectiveConfig(prisma);
    return c.json({
      active: config.fromDatabase
        ? { name: config.name, providerType: config.providerType, model: config.model, baseURL: config.baseURL, fromDatabase: true }
        : { name: '环境变量配置', providerType: 'minimax', model: config.model, baseURL: config.baseURL, fromDatabase: false }
    });
  } catch (error) {
    console.error('Get active API provider error:', error);
    return c.json({ error: '获取当前API提供商失败' }, 500);
  }
});

router.get('/projects/repos', async (c) => {
  try {
    const prisma = c.get('prisma');
    const q = c.req.query();
    let hasDeployUrl: boolean | undefined;
    if (q.hasDeployUrl === 'true') hasDeployUrl = true;
    else if (q.hasDeployUrl === 'false') hasDeployUrl = false;
    const repos = await getAllProjectRepos(prisma, hasDeployUrl);
    return c.json({ repos });
  } catch (error) {
    console.error('Get project repos error:', error);
    return c.json({ error: '获取项目仓库信息失败' }, 500);
  }
});

router.get('/projects/repos/export', async (c) => {
  try {
    const prisma = c.get('prisma');
    const repos = await getAllProjectRepos(prisma);
    const XLSX = await import('xlsx');
    const rows = repos.map((r: any) => ({
      '学号': r.studentId,
      '姓名': r.studentName,
      '专业': r.major,
      '选题名称': r.topicTitle,
      '仓库地址': r.repoUrl || '',
      '访问地址': r.deployUrl || '',
      '最近同步时间': r.syncedAt ? new Date(r.syncedAt).toLocaleString('zh-CN') : '',
      '提交数': r.commitCount,
    }));
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(rows);
    XLSX.utils.book_append_sheet(wb, ws, '项目仓库地址');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    c.header('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    c.header('Content-Disposition', buildAttachmentHeader('project-repos.xlsx', '项目仓库地址.xlsx'));
    return c.body(buf as any);
  } catch (error) {
    console.error('Export project repos error:', error);
    return c.json({ error: '导出失败' }, 500);
  }
});

router.put('/projects/:id/deployUrl', async (c) => {
  try {
    const prisma = c.get('prisma');
    const projectId = parseInt(c.req.param('id'));
    const { deployUrl } = await c.req.json();

    if (isNaN(projectId)) {
      return c.json({ error: '无效的项目ID' }, 400);
    }
    if (deployUrl && typeof deployUrl === 'string' && deployUrl.length > 500) {
      return c.json({ error: '访问地址过长' }, 400);
    }

    await adminUpdateDeployUrl(prisma, projectId, deployUrl || null);
    return c.json({ message: '访问地址已更新' });
  } catch (error: any) {
    if (error.message === 'PROJECT_NOT_FOUND') {
      return c.json({ error: '项目不存在' }, 404);
    }
    console.error('Admin deploy URL update error:', error);
    return c.json({ error: '更新访问地址失败' }, 500);
  }
});

// ============================================================
// GRADUATION THESIS MANAGEMENT
// ============================================================

router.get('/thesis/topics', async (c) => {
  try {
    const prisma = c.get('prisma');
    const topics = await prisma.thesisTopic.findMany({
      orderBy: [{ category: 'asc' }, { id: 'asc' }],
      include: {
        lockedBy: {
          select: { id: true, name: true, studentId: true, class: true, grade: true }
        },
        project: {
          select: { id: true, repoUrl: true, deployUrl: true, createdAt: true }
        }
      }
    });
    return c.json({ topics, total: topics.length });
  } catch (error) {
    console.error('Admin thesis topics error:', error);
    return c.json({ error: '获取毕业设计题目失败' }, 500);
  }
});

router.get('/thesis/projects', async (c) => {
  try {
    const prisma = c.get('prisma');
    const q = c.req.query();
    const page = parseInt(q.page || '') || 1;
    const pageSize = parseInt(q.pageSize || '') || 20;
    const search = q.search || '';
    const skip = (page - 1) * pageSize;

    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { user: { name: { contains: search } } },
        { user: { studentId: { contains: search } } },
        { topic: { title: { contains: search } } },
      ];
    }

    const [projects, total] = await Promise.all([
      prisma.thesisProject.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, studentId: true, class: true, grade: true } },
          topic: { select: { id: true, title: true, category: true, datasetName: true } }
        }
      }),
      prisma.thesisProject.count({ where: whereClause })
    ]);

    return c.json({ projects, total, page, pageSize });
  } catch (error) {
    console.error('Admin thesis projects error:', error);
    return c.json({ error: '获取毕业设计项目失败' }, 500);
  }
});

export default router;
