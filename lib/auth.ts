import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/lib/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;
        if (typeof email !== "string" || typeof password !== "string") {
          return null;
        }

        const staffUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });
        if (staffUser && staffUser.isActive) {
          const valid = await bcrypt.compare(password, staffUser.passwordHash);
          if (valid) {
            return {
              id: staffUser.id,
              email: staffUser.email,
              name: `${staffUser.firstName} ${staffUser.lastName}`,
              accountType: "STAFF" as const,
              garageId: staffUser.garageId,
              role: staffUser.role,
            };
          }
        }

        const clientAccount = await prisma.clientPortalAccount.findUnique({
          where: { email: email.toLowerCase() },
          include: { client: true },
        });
        if (clientAccount && clientAccount.isActive) {
          const valid = await bcrypt.compare(password, clientAccount.passwordHash);
          if (valid) {
            return {
              id: clientAccount.id,
              email: clientAccount.email,
              name: `${clientAccount.client.firstName} ${clientAccount.client.lastName}`,
              accountType: "CLIENT" as const,
              garageId: clientAccount.client.garageId,
              clientId: clientAccount.clientId,
            };
          }
        }

        return null;
      },
    }),
  ],
});
