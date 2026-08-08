import { prisma } from "@/lib/prisma";
import type { ContactMessageInput } from "@/lib/validations/contact";

export async function createContactMessage(data: ContactMessageInput) {
  return prisma.contactMessage.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      category: data.category,
      message: data.message,
    },
  });
}
