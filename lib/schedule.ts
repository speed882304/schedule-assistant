import fs from "fs";
import path from "path";
import { Course } from "@/types";

const DATA_PATH = path.join(process.cwd(), "data", "schedule.json");

export function readSchedule(): Course[] {
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  return JSON.parse(raw) as Course[];
}

export function writeSchedule(courses: Course[]): void {
  fs.writeFileSync(DATA_PATH, JSON.stringify(courses, null, 2), "utf-8");
}

export function addCourse(course: Course): Course {
  const courses = readSchedule();
  courses.push(course);
  writeSchedule(courses);
  return course;
}

export function deleteCourse(id: string): boolean {
  const courses = readSchedule();
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;
  writeSchedule(filtered);
  return true;
}
