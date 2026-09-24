import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import * as argon2 from 'argon2';
import { PrismaClient } from '../src/generated/prisma/client';
import { RoleName, UserStatus } from '../src/generated/prisma/enums';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
const locationNames = [
  'Águas Claras',
  'Ceilândia',
  'Samambaia',
  'Taguatinga',
  'Vicente Pires',
  'Guará',
  'Riacho Fundo',
  'Recanto das Emas',
  'UCB Taguatinga',
];

async function seed() {
  for (const name of Object.values(RoleName))
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  for (const name of locationNames)
    await prisma.location.upsert({
      where: { name },
      update: { active: true },
      create: { name, type: name.startsWith('UCB') ? 'CAMPUS' : 'REGION' },
    });
  if (process.env.SEED_ADMIN_EMAIL && process.env.SEED_ADMIN_PASSWORD) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: RoleName.ADMIN } });
    const admin = await prisma.user.upsert({
      where: { institutionalEmail: process.env.SEED_ADMIN_EMAIL },
      update: {},
      create: {
        fullName: 'Administrador UniMove',
        cpf: '00000000191',
        institutionalEmail: process.env.SEED_ADMIN_EMAIL,
        passwordHash: await argon2.hash(process.env.SEED_ADMIN_PASSWORD),
        status: UserStatus.ACTIVE,
      },
    });
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: role.id } },
      update: {},
      create: { userId: admin.id, roleId: role.id },
    });
  }
}
void seed().finally(() => prisma.$disconnect());
