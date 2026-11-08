import { notFound, redirect } from "next/navigation";
import { getPolaroid } from "@/lib/polaroids";

// The camera must run in a top-level page rather than an iframe.
// The existing QR printed on older Polaroids continues to work.
export default async function PolaroidPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!getPolaroid(id)) notFound();
  if (id === "demo") redirect("/ar/demo.html");
  notFound();
}
