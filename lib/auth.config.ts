import type { NextAuthConfig } from "next-auth";

/**
 * Config Auth.js "edge-safe" (aucun import Prisma/pg ici) — utilisée par
 * `middleware.ts` (runtime Edge) pour les décisions de routage. Le provider
 * Credentials (qui interroge la base) n'est ajouté que dans `lib/auth.ts`,
 * utilisé côté Node (routes API, Server Actions, Server Components).
 */
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/connexion",
  },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accountType = user.accountType;
        token.garageId = user.garageId;
        token.role = user.role;
        token.clientId = user.clientId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.accountType = token.accountType;
      session.user.garageId = token.garageId;
      session.user.role = token.role;
      session.user.clientId = token.clientId;
      return session;
    },
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      if (pathname.startsWith("/dashboard")) {
        return isLoggedIn && auth!.user.accountType === "STAFF";
      }
      if (pathname.startsWith("/portail")) {
        return isLoggedIn && auth!.user.accountType === "CLIENT";
      }
      return true;
    },
  },
};
