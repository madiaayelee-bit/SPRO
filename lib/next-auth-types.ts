import { Role } from "@/app/generated/prisma/client";
import type { DefaultSession } from "next-auth";

type AccountType = "STAFF" | "CLIENT";

declare module "next-auth" {
  interface User {
    accountType: AccountType;
    garageId: string;
    role?: Role;
    clientId?: string;
  }

  interface Session {
    user: {
      id: string;
      accountType: AccountType;
      garageId: string;
      role?: Role;
      clientId?: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accountType: AccountType;
    garageId: string;
    role?: Role;
    clientId?: string;
  }
}
