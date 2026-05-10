import { PrismaClient } from '../generated/prisma'
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Update admin password
  const adminHash = await bcrypt.hash('admin123', 10);
  await prisma.user.update({
    where: { studentId: 'admin' },
    data: { password: adminHash }
  });

  // Update student password
  const studentHash = await bcrypt.hash('2024001', 10);
  await prisma.user.update({
    where: { studentId: '2024001' },
    data: { password: studentHash }
  });

  console.log('Passwords updated successfully!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());