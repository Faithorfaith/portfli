"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SESSION_COOKIE } from "@/lib/auth";

export async function signIn(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const redirectTo = String(formData.get("redirectTo") ?? "/");

  if (!name || !email) {
    throw new Error("Name and email are required.");
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name, email },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(redirectTo || "/");
}

export async function demoSignIn(role: "READER" | "ADMIN") {
  const email = role === "ADMIN" ? "admin@openshelf.app" : "reader.demo@openshelf.app";
  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: role === "ADMIN" ? "Admin Reviewer" : "Demo Reader",
      role,
      isVerified: role === "ADMIN",
    },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(role === "ADMIN" ? "/admin" : "/");
}

export async function signOut() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/");
}
