import { PrismaClient } from '../generated/prisma'
import { hashPassword } from '../utils/password.utils.js';

const prisma = new PrismaClient();

async function initAdmin() {
  const adminStudentId = 'admin';      // D-15
  const adminPassword = 'admin123';    // D-16
  const adminName = '系统管理员';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { studentId: adminStudentId }
  });

  if (existingAdmin) {
    console.log('Admin account already exists');
    console.log('StudentId: admin');
    console.log('If you need to reset password, manually delete and re-run');
  } else {
    // Hash password with bcrypt (10 rounds)
    const hashedPassword = await hashPassword(adminPassword);

    // Create admin user (D-15, D-16)
    await prisma.user.create({
      data: {
        studentId: adminStudentId,
        name: adminName,
        major: '系统',
        grade: '系统',
        class: '系统',
        password: hashedPassword,
        passwordIsDefault: true,
        role: 'ADMIN',
        status: 'ACTIVE'
      }
    });

    console.log('Default admin account created successfully!');
    console.log('Login credentials:');
    console.log('  StudentId: admin');
    console.log('  Password: admin123');
    console.log('');
    console.log('IMPORTANT: Please change password after first login!');
  }

  // Create test/viewer account
  const testStudentId = 'test';
  const testPassword = 'test123';

  const existingTest = await prisma.user.findUnique({
    where: { studentId: testStudentId }
  });

  if (existingTest) {
    console.log('Test account already exists');
  } else {
    const hashedTestPassword = await hashPassword(testPassword);

    await prisma.user.create({
      data: {
        studentId: testStudentId,
        name: '测试账号',
        major: '测试',
        grade: '测试',
        class: '测试',
        password: hashedTestPassword,
        passwordIsDefault: false,
        role: 'VIEWER',
        status: 'ACTIVE'
      }
    });

    console.log('Test (VIEWER) account created successfully!');
    console.log('Login credentials:');
    console.log('  StudentId: test');
    console.log('  Password: test123');
  }

  // Seed graduation config defaults
  const graduationEnabled = await prisma.systemConfig.findUnique({
    where: { key: 'graduationEnabled' }
  });

  if (!graduationEnabled) {
    await prisma.systemConfig.create({
      data: { key: 'graduationEnabled', value: 'false', description: '毕业设计选题开关' }
    });
    console.log('Default graduationEnabled config created (disabled)');
  }

  const graduationWhitelist = await prisma.systemConfig.findUnique({
    where: { key: 'graduationWhitelist' }
  });

  if (!graduationWhitelist) {
    await prisma.systemConfig.create({
      data: { key: 'graduationWhitelist', value: '231311111', description: '毕业设计白名单（逗号分隔学号）' }
    });
    console.log('Default graduationWhitelist config created (231311111)');
  }
}

initAdmin()
  .then(async () => {
    await prisma.$disconnect();
    console.log('Script completed');
  })
  .catch(async (e) => {
    console.error('Error creating admin:', e);
    await prisma.$disconnect();
    process.exit(1);
  });