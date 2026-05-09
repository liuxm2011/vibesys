import { PrismaClient, Domain, TopicType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing system topics (for clean seed)
  await prisma.topic.deleteMany({
    where: { type: TopicType.SYSTEM }
  });

  // System topics for 软件工程 (SE) domain
  const seTopics = [
    {
      title: '在线图书管理系统',
      description: '实现一个完整的图书管理Web应用，包括图书信息管理、借阅流程、用户权限等功能。',
      background: '图书馆需要数字化转型，提高图书管理效率，减少人工操作。',
      objectives: '用户可以搜索图书、借阅归还、管理员可以管理图书信息和用户账号。',
      domain: Domain.SE,
      techStack: ['Vue 3', 'Node.js', 'MySQL', 'Element Plus'],
      type: TopicType.SYSTEM,
    },
    {
      title: '学生成绩管理系统',
      description: '开发学生成绩录入、查询、统计分析系统，支持多角色权限控制。',
      background: '学校需要统一的成绩管理平台，方便教师录入和学生查询。',
      objectives: '教师录入成绩、学生查询成绩、管理员管理班级和课程信息。',
      domain: Domain.SE,
      techStack: ['React', 'Express', 'MongoDB', 'Ant Design'],
      type: TopicType.SYSTEM,
    },
    {
      title: '校园二手交易平台',
      description: '搭建校内二手物品交易平台，支持发布、浏览、交易和评价功能。',
      background: '学生有大量闲置物品需要处理，需要安全的校内交易渠道。',
      objectives: '学生可以发布闲置物品、浏览搜索、联系交易、评价反馈。',
      domain: Domain.SE,
      techStack: ['Vue 3', 'Spring Boot', 'MySQL', 'Bootstrap'],
      type: TopicType.SYSTEM,
    },
  ];

  // System topics for 大数据 (BD) domain
  const bdTopics = [
    {
      title: '学生行为数据分析平台',
      description: '基于学生校园行为数据，进行数据采集、清洗、分析和可视化展示。',
      background: '学校积累了大量学生行为数据，需要分析工具辅助决策。',
      objectives: '采集多源数据、清洗整合、统计分析、可视化报表。',
      domain: Domain.BD,
      techStack: ['Python', 'Pandas', 'Matplotlib', 'Hadoop'],
      type: TopicType.SYSTEM,
    },
    {
      title: '校园网络流量监控系统',
      description: '实时监控校园网络流量，分析流量模式，预警异常行为。',
      background: '网络安全需求增加，需要实时监控校园网络状态。',
      objectives: '流量采集、实时监控、异常检测、可视化展示。',
      domain: Domain.BD,
      techStack: ['Flume', 'Kafka', 'Spark Streaming', 'ECharts'],
      type: TopicType.SYSTEM,
    },
    {
      title: '图书馆借阅数据分析',
      description: '分析图书馆借阅数据，挖掘借阅模式，推荐热门图书。',
      background: '图书馆借阅数据丰富，可用于分析阅读趋势和优化馆藏。',
      objectives: '数据采集、借阅分析、趋势预测、智能推荐。',
      domain: Domain.BD,
      techStack: ['Python', 'Scikit-learn', 'TensorFlow', 'D3.js'],
      type: TopicType.SYSTEM,
    },
  ];

  // Insert all system topics
  for (const topic of [...seTopics, ...bdTopics]) {
    await prisma.topic.create({
      data: topic
    });
  }

  console.log('Seed completed: 6 system topics created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });