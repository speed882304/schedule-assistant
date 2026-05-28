import { Course } from "@/types";

const KEY = "schedule-data";
const SEEDED_KEY = "schedule-seeded";

const SEED_DATA: Course[] = [
  {"id":"1779883035291","name":"数控技术及编程","day":1,"startTime":"10:20","endTime":"12:10","location":"2教113","teacher":"赵武云教授","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},
  {"id":"1779883113824","name":"机械系统设计","day":1,"startTime":"14:00","endTime":"13:50","location":"3教501","teacher":"姚亚萍讲师","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},
  {"id":"1779883226046","name":"机电一体化技术","day":2,"startTime":"10:20","endTime":"12:10","location":"4教503","teacher":"张鹏讲师","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},
  {"id":"1779883303983","name":"优化设计","day":2,"startTime":"16:20","endTime":"18:10","location":"4教402","teacher":"祁渊","weeks":[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]},
  {"id":"1779883414099","name":"就业指导与创业教育","day":3,"startTime":"14:00","endTime":"15:50","location":"3教109","teacher":"于佳副教授","weeks":[14,15,16,17]},
  {"id":"1779883503224","name":"现代测试技术","day":4,"startTime":"10:20","endTime":"12:10","location":"2教301","teacher":"刘柯楠副教授","weeks":[9,10,11,12,13,14,15,16]},
  {"id":"1779883563146","name":"现代企业管理","day":5,"startTime":"10:20","endTime":"12:10","location":"3教105","teacher":"马国军教授","weeks":[4,5,6,7,8,9,10,11,12,13,14,15]},
  {"id":"1779893758663","name":"机械系统设计","day":3,"startTime":"08:00","endTime":"09:50","location":"2教316","teacher":"姚亚萍讲师","weeks":[5,7,9,11,13]},
  {"id":"1779893826610","name":"现代测试技术","day":3,"startTime":"08:00","endTime":"09:50","location":"2教301","teacher":"刘柯楠副教授","weeks":[10,12,14,16]},
  {"id":"1779893913878","name":"数控技术及编程","day":3,"startTime":"16:20","endTime":"18:10","location":"2教108","teacher":"赵武云教授","weeks":[5,7,9,11,13]},
];

export function loadSchedule(): Course[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function seedIfEmpty(): void {
  if (typeof window === "undefined") return;
  if (localStorage.getItem(SEEDED_KEY)) return;
  const existing = loadSchedule();
  if (existing.length === 0) {
    localStorage.setItem(KEY, JSON.stringify(SEED_DATA));
  }
  localStorage.setItem(SEEDED_KEY, "1");
}

export function saveSchedule(courses: Course[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(courses));
}

export function addCourse(course: Course): Course {
  const courses = loadSchedule();
  courses.push(course);
  saveSchedule(courses);
  return course;
}

export function deleteCourse(id: string): boolean {
  const courses = loadSchedule();
  const filtered = courses.filter((c) => c.id !== id);
  if (filtered.length === courses.length) return false;
  saveSchedule(filtered);
  return true;
}
