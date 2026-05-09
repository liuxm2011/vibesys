import { PrismaClient } from '@prisma/client';
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
    return;
  }

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