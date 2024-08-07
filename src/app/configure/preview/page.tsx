import { db } from "@/db";
import { notFound } from "next/navigation";
import DesignPreview from "./DesignPreview";
import { auth } from "@/auth";

interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}
export default async function page({ searchParams }: PageProps) {
  const { id } = searchParams;
  if (!id || typeof id !== "string") {
    return notFound();
  }
  const session = await auth();
  const configuration = await db.configuration.findUnique({
    where: { id },
  });
  if (!configuration) {
    return notFound();
  }

  return <DesignPreview configuration={configuration} />;
}
