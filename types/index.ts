export interface Course {
  id: string;
  name: string;
  day: number; // 1-7, 周一至周日
  startTime: string; // "08:00"
  endTime: string; // "09:40"
  location: string;
  teacher: string;
  weeks: number[];
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export interface ChatRequest {
  messages: Message[];
}

export const DAY_LABELS: Record<number, string> = {
  1: "周一",
  2: "周二",
  3: "周三",
  4: "周四",
  5: "周五",
  6: "周六",
  7: "周日",
};

export const COURSE_COLORS = [
  "#60a5fa",
  "#f472b6",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#fb923c",
  "#38bdf8",
  "#f87171",
];

export type ViewType = "welcome" | "chat" | "schedule" | "add-course";
