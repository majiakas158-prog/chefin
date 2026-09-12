import { prisma } from "../lib/prisma.js";
export async function getProfile(userId) {
  return prisma.profile.findUnique({
    where: { userId },
    include: {
      user: { select: { id: true, name: true, email: true, image: true } },
    },
  });
}
export async function updateProfile(userId, data) {
  return prisma.profile.upsert({
    where: { userId },
    create: { userId, role: data.role ?? "chef", ...data },
    update: data,
  });
}
