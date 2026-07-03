import { redirect } from "next/navigation";
import SubmitWizard from "@/components/SubmitWizard";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function SubmitPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/signin?redirectTo=/submit");

  const shelves = await prisma.shelf.findMany({ orderBy: { order: "asc" } });

  return <SubmitWizard shelves={shelves} />;
}
