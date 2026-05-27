import { NextResponse } from "next/server";
import { readSchedule, addCourse } from "@/lib/schedule";
import { Course } from "@/types";

export async function GET() {
  const courses = readSchedule();
  return NextResponse.json(courses);
}

export async function POST(request: Request) {
  const body = await request.json();
  const course: Course = {
    id: Date.now().toString(),
    name: body.name,
    day: body.day,
    startTime: body.startTime,
    endTime: body.endTime,
    location: body.location,
    teacher: body.teacher,
    weeks: body.weeks,
  };
  addCourse(course);
  return NextResponse.json(course, { status: 201 });
}
