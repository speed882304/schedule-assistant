import { NextResponse } from "next/server";
import { deleteCourse } from "@/lib/schedule";

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const success = deleteCourse(params.id);
  if (!success) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
