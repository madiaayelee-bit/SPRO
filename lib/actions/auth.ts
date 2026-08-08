"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/lib/auth";
import { createGarageAndOwner, EmailAlreadyUsedError } from "@/lib/db/garages";
import { registerGarageSchema } from "@/lib/validations/auth";
import { checkRateLimit } from "@/lib/rate-limit";

export type FormState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function registerGarageAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const parsed = registerGarageSchema.safeParse({
    garageName: formData.get("garageName"),
    garagePhone: formData.get("garagePhone"),
    ownerFirstName: formData.get("ownerFirstName"),
    ownerLastName: formData.get("ownerLastName"),
    ownerEmail: formData.get("ownerEmail"),
    ownerPassword: formData.get("ownerPassword"),
  });

  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors };
  }

  const rateLimit = checkRateLimit(`register:${parsed.data.ownerEmail}`);
  if (!rateLimit.allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  try {
    await createGarageAndOwner(parsed.data);
  } catch (err) {
    if (err instanceof EmailAlreadyUsedError) {
      return { error: err.message };
    }
    throw err;
  }

  await signIn("credentials", {
    email: parsed.data.ownerEmail,
    password: parsed.data.ownerPassword,
    redirectTo: "/dashboard",
  });

  return {};
}

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  const rateLimit = checkRateLimit(`login:${String(email).toLowerCase()}`);
  if (!rateLimit.allowed) {
    return { error: "Trop de tentatives. Réessayez dans quelques minutes." };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/apres-connexion",
    });
  } catch (err) {
    if (err instanceof AuthError) {
      return { error: "Email ou mot de passe incorrect." };
    }
    throw err;
  }

  return {};
}

export async function logoutAction() {
  const { signOut } = await import("@/lib/auth");
  await signOut({ redirectTo: "/" });
}
