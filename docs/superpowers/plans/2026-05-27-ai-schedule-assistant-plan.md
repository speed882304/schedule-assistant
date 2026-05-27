# AI 课表助手 — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a dark-themed AI class schedule assistant with ChatGPT-style UI, Claude API chat, schedule viewing, and course management.

**Architecture:** Next.js 14 App Router with a Sidebar layout at `/app`. Landing page at `/`. API routes for Claude chat (streaming SSE) and schedule CRUD (JSON file). Client-side state for view switching and conversation management.

**Tech Stack:** Next.js 14, TypeScript, Tailwind CSS, Anthropic SDK, LocalStorage (conversations), JSON file (schedule data)

---

## File Map

```
app/
├── globals.css                      # Dark theme global styles
├── layout.tsx                       # Root layout (metadata)
├── page.tsx                         # Landing page
├── app/
│   ├── layout.tsx                   # App layout (sidebar + main)
│   └── page.tsx                     # Main app with view switching state
├── api/
│   ├── chat/
│   │   └── route.ts                 # POST - Claude streaming chat
│   └── schedule/
│       ├── route.ts                 # GET (list), POST (add)
│       └── [id]/
│           └── route.ts             # DELETE
components/
├── Sidebar.tsx                      # Sidebar navigation + conversation list
├── WelcomeView.tsx                  # Welcome / landing in-app
├── ChatView.tsx                     # Chat UI (message list + input)
├── ChatInput.tsx                    # Message input box
├── MessageBubble.tsx                # Single chat bubble
├── ScheduleView.tsx                 # Weekly schedule table view
├── AddCourseView.tsx                # Add course form page
├── ConversationList.tsx             # Conversation history list in sidebar
├── Hero.tsx                         # Landing hero section
├── Features.tsx                     # Landing features section
└── Footer.tsx                       # Landing footer
data/
└── schedule.json                    # Initial course data
lib/
├── schedule.ts                      # Read/write helpers for schedule JSON
└── anthropic.ts                     # Anthropic SDK client singleton
types/
└── index.ts                         # Shared TypeScript types
.env.local                           # ANTHROPIC_API_KEY
```

---

### Task 1: Initialize Next.js project

**Files:**
- Create: next.config.js (auto-generated + updates), tailwind.config.ts (auto), package.json (auto), tsconfig.json (auto)
- Create: `.env.local`

- [ ] **Step 1: Scaffold Next.js with Tailwind**

Run:
```bash
cd "C:/Users/lenovo/Desktop/新建文件夹" && npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*" --no-git --use-npm
```

Expected: Project scaffolded, success message

- [ ] **Step 2: Create .env.local**

Write `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
```

- [ ] **Step 3: Install Anthropic SDK**

Run:
```bash
cd "C:/Users/lenovo/Desktop/新建文件夹" && npm install @anthropic-ai/sdk
```

Expected: Package installed

- [ ] **Step 4: Verify dev server starts**

Run:
```bash
cd "C:/Users/lenovo/Desktop/新建文件夹" && timeout 10 npm run dev || true
```

Expected: Dev server starts on localhost:3000

---

### Task 2: Create TypeScript types

**Files:**
- Create: `types/index.ts`

- [ ] **Step 1: Write types file**

Write `types/index.ts`:
```typescript
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
```

---

### Task 3: Create schedule data helpers

**Files:**
- Create: `lib/schedule.ts`

- [ ] **Step 1: Write schedule lib**

Write `lib/schedule.ts`:
```typescript
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
```

---

### Task 4: Create initial schedule JSON

**Files:**
- Create: `data/schedule.json`

- [ ] **Step 1: Write initial schedule data**

Write `data/schedule.json`:
```json
[
  {
    "id": "1",
    "name": "高等数学",
    "day": 1,
    "startTime": "08:00",
    "endTime": "09:40",
    "location": "教学楼A301",
    "teacher": "张老师",
    "weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  {
    "id": "2",
    "name": "大学英语",
    "day": 2,
    "startTime": "10:00",
    "endTime": "11:40",
    "location": "教学楼B205",
    "teacher": "李老师",
    "weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  {
    "id": "3",
    "name": "数据结构",
    "day": 3,
    "startTime": "14:00",
    "endTime": "15:40",
    "location": "实验楼C102",
    "teacher": "王老师",
    "weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  {
    "id": "4",
    "name": "马克思主义原理",
    "day": 4,
    "startTime": "08:00",
    "endTime": "09:40",
    "location": "教学楼D401",
    "teacher": "赵老师",
    "weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  },
  {
    "id": "5",
    "name": "体育",
    "day": 5,
    "startTime": "15:00",
    "endTime": "16:40",
    "location": "体育馆",
    "teacher": "陈老师",
    "weeks": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
  }
]
```

---

### Task 5: Create Anthropic client helper

**Files:**
- Create: `lib/anthropic.ts`

- [ ] **Step 1: Write Anthropic client**

Write `lib/anthropic.ts`:
```typescript
import Anthropic from "@anthropic-ai/sdk";

let client: Anthropic | null = null;

export function getAnthropicClient(): Anthropic {
  if (!client) {
    client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY || "",
    });
  }
  return client;
}

export const SYSTEM_PROMPT = `你是一个 AI 课表助手。你可以帮助用户查看课表、了解课程安排。

## 课表数据
当前课表如下：
{SCHEDULE_DATA}

## 你的职责
1. 回答所有课表相关问题（明天有什么课、某个课程在哪里上、什么时间上课等）
2. 当用户想添加新课程时，收集以下信息：课程名称、星期几(1-7)、开始时间、结束时间、上课地点、授课教师、周次范围。收集完后引导用户点击侧边栏的"添加课程"手动添加。
3. 用友好、简洁、有帮助的方式回复。
4. 如果用户问与课表无关的问题，可以简单回应，但引导回课表相关话题。

请用中文回复。`;
```

---

### Task 6: Create schedule API routes

**Files:**
- Create: `app/api/schedule/route.ts`
- Create: `app/api/schedule/[id]/route.ts`

- [ ] **Step 1: Write GET and POST route**

Write `app/api/schedule/route.ts`:
```typescript
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
```

- [ ] **Step 2: Write DELETE route**

Write `app/api/schedule/[id]/route.ts`:
```typescript
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
```

---

### Task 7: Create chat API route

**Files:**
- Create: `app/api/chat/route.ts`

- [ ] **Step 1: Write chat streaming route**

Write `app/api/chat/route.ts`:
```typescript
import { NextRequest } from "next/server";
import { getAnthropicClient, SYSTEM_PROMPT } from "@/lib/anthropic";
import { readSchedule } from "@/lib/schedule";
import { Message } from "@/types";

export async function POST(request: NextRequest) {
  const { messages } = (await request.json()) as { messages: Message[] };

  const scheduleData = JSON.stringify(readSchedule(), null, 2);
  const systemPrompt = SYSTEM_PROMPT.replace("{SCHEDULE_DATA}", scheduleData);

  const anthropicMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  const stream = await getAnthropicClient().messages.stream({
    model: "claude-sonnet-4-6",
    max_tokens: 2048,
    system: systemPrompt,
    messages: anthropicMessages,
  });

  return new Response(stream.toReadableStream(), {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
```

---

### Task 8: Create global dark theme styles

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Replace globals.css with dark theme**

Write `app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  scrollbar-width: thin;
  scrollbar-color: #333 transparent;
}

body {
  background-color: #0f0f0f;
  color: #e0e0e0;
}

/* Custom scrollbar for webkit */
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Markdown content in AI messages */
.markdown-content p {
  margin-bottom: 0.5rem;
}
.markdown-content p:last-child {
  margin-bottom: 0;
}
.markdown-content code {
  background: #2d2d2d;
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
  font-size: 0.875em;
}
.markdown-content pre {
  background: #1a1a1a;
  padding: 0.75rem;
  border-radius: 0.5rem;
  overflow-x: auto;
  margin: 0.5rem 0;
}
.markdown-content pre code {
  background: none;
  padding: 0;
}
```

---

### Task 9: Create root layout

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Write root layout**

Write `app/layout.tsx`:
```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 课表助手",
  description: "智能管理你的课程表，随时随地查询课表信息",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-[#0f0f0f] text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
```

---

### Task 10: Create landing page

**Files:**
- Modify: `app/page.tsx`
- Create: `components/Hero.tsx`
- Create: `components/Features.tsx`
- Create: `components/Footer.tsx`

- [ ] **Step 1: Write Hero component**

Write `components/Hero.tsx`:
```typescript
import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 pt-32 pb-20">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        AI 课表助手
      </h1>
      <p className="text-xl text-gray-400 max-w-xl mb-10">
        用 AI 智能管理你的课程表。随时对话查询、快速添加修改，让课表管理变得简单高效。
      </p>
      <Link
        href="/app"
        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-lg"
      >
        开始使用
      </Link>
    </section>
  );
}
```

- [ ] **Step 2: Write Features component**

Write `components/Features.tsx`:
```typescript
const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI 智能对话",
    desc: "像聊天一样查询课表，明天有什么课？数学课在哪上？AI 即时回答。",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "课表可视化",
    desc: "一周课程一目了然，按天分组卡片展示，彩色标签区分不同课程。",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "轻松添加课程",
    desc: "填写课程信息一键添加，支持课程名、时间、地点、教师、周次。",
  },
];

export default function Features() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-14">核心功能</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Write Footer component**

Write `components/Footer.tsx`:
```typescript
export default function Footer() {
  return (
    <footer className="text-center text-gray-600 text-sm py-10 border-t border-gray-800">
      AI 课表助手 &copy; 2026 — 让课表管理更智能
    </footer>
  );
}
```

- [ ] **Step 4: Write landing page**

Write `app/page.tsx`:
```typescript
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
```

---

### Task 11: Create Sidebar component

**Files:**
- Create: `components/Sidebar.tsx`
- Create: `components/ConversationList.tsx`

- [ ] **Step 1: Write ConversationList component**

Write `components/ConversationList.tsx`:
```typescript
import { Conversation } from "@/types";

interface Props {
  conversations: Conversation[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function ConversationList({
  conversations,
  activeId,
  onSelect,
  onDelete,
}: Props) {
  if (conversations.length === 0) {
    return (
      <p className="text-gray-500 text-sm px-3 py-2">暂无对话记录</p>
    );
  }

  return (
    <div className="space-y-0.5">
      {conversations.map((conv) => (
        <div
          key={conv.id}
          className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
            activeId === conv.id
              ? "bg-[#2a2a2a] text-gray-100"
              : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
          }`}
          onClick={() => onSelect(conv.id)}
        >
          <span className="truncate flex-1">{conv.title}</span>
          <button
            className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-1 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(conv.id);
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Write Sidebar component**

Write `components/Sidebar.tsx`:
```typescript
"use client";

import { Conversation, ViewType } from "@/types";
import ConversationList from "./ConversationList";
import Link from "next/link";

interface Props {
  conversations: Conversation[];
  activeConvId: string | null;
  currentView: ViewType;
  onNewChat: () => void;
  onSelectConv: (id: string) => void;
  onDeleteConv: (id: string) => void;
  onViewChange: (view: ViewType) => void;
}

export default function Sidebar({
  conversations,
  activeConvId,
  currentView,
  onNewChat,
  onSelectConv,
  onDeleteConv,
  onViewChange,
}: Props) {
  const navItems: { view: ViewType; label: string; icon: React.ReactNode }[] = [
    {
      view: "chat",
      label: "AI 对话",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
    },
    {
      view: "schedule",
      label: "查看课表",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      view: "add-course",
      label: "添加课程",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  ];

  return (
    <aside className="w-64 h-screen bg-[#171717] border-r border-gray-800 flex flex-col shrink-0">
      {/* Logo */}
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI 课表助手
          </span>
        </Link>
      </div>

      {/* New Chat Button */}
      <div className="p-3">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-[#1f1f1f] transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          新对话
        </button>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto px-2 py-1">
        <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">对话历史</p>
        <ConversationList
          conversations={conversations}
          activeId={activeConvId}
          onSelect={onSelectConv}
          onDelete={onDeleteConv}
        />
      </div>

      {/* Nav Links */}
      <div className="border-t border-gray-800 p-3 space-y-1">
        {navItems.map((item) => (
          <button
            key={item.view}
            onClick={() => onViewChange(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
              currentView === item.view
                ? "bg-[#2a2a2a] text-gray-100"
                : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
            }`}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </div>
    </aside>
  );
}
```

---

### Task 12: Create WelcomeView component

**Files:**
- Create: `components/WelcomeView.tsx`

- [ ] **Step 1: Write WelcomeView**

Write `components/WelcomeView.tsx`:
```typescript
interface Props {
  onStart: () => void;
}

export default function WelcomeView({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="mb-6">
        <svg className="w-16 h-16 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3">欢迎使用 AI 课表助手</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        你可以直接和我对话查询课表，或点击侧边栏查看完整课表和添加课程。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {["我明天有什么课？", "高等数学在哪里上？", "帮我整理一周课表"].map((q) => (
          <button
            key={q}
            onClick={onStart}
            className="px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-[#1f1f1f] hover:border-gray-600 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
```

---

### Task 13: Create MessageBubble and ChatInput components

**Files:**
- Create: `components/MessageBubble.tsx`
- Create: `components/ChatInput.tsx`

- [ ] **Step 1: Write MessageBubble**

Write `components/MessageBubble.tsx`:
```typescript
import { Message } from "@/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#2b3d5c] text-gray-100 rounded-br-md"
            : "bg-[#1e1e1e] text-gray-200 rounded-bl-md border border-gray-800"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div
            className="markdown-content text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  let html = text
    // Bold
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    // Italic
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    // Inline code
    .replace(/`(.+?)`/g, "<code>$1</code>")
    // Line breaks
    .replace(/\n/g, "<br/>");
  return html;
}
```

- [ ] **Step 2: Write ChatInput**

Write `components/ChatInput.tsx`:
```typescript
"use client";

import { useState, useRef, useEffect, KeyboardEvent } from "react";

interface Props {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: Props) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + "px";
    }
  }, [input]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-gray-800 bg-[#0f0f0f] p-4">
      <div className="max-w-3xl mx-auto flex gap-3 items-end">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息，Enter 发送，Shift+Enter 换行"
          rows={1}
          disabled={disabled}
          className="flex-1 bg-[#1e1e1e] border border-gray-700 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-500 resize-none outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="shrink-0 w-10 h-10 flex items-center justify-center bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </div>
    </div>
  );
}
```

---

### Task 14: Create ChatView component

**Files:**
- Create: `components/ChatView.tsx`

- [ ] **Step 1: Write ChatView**

Write `components/ChatView.tsx`:
```typescript
"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";

interface Props {
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
}

export default function ChatView({ messages, onMessagesUpdate }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMsg: Message = { role: "user", content };
    const updatedMessages = [...messages, userMsg];
    onMessagesUpdate(updatedMessages);

    setIsLoading(true);
    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
        signal: abortRef.current.signal,
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No body");

      const decoder = new TextDecoder();
      let aiContent = "";

      onMessagesUpdate([...updatedMessages, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.startsWith("data: "));

        for (const line of lines) {
          const data = line.slice(6);
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            if (parsed.type === "content_block_delta" && parsed.delta?.text) {
              aiContent += parsed.delta.text;
              const msgs = [...updatedMessages, { role: "assistant" as const, content: aiContent }];
              onMessagesUpdate(msgs);
            }
          } catch {
            // Skip unparseable chunks
          }
        }
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      const errorMsg = "抱歉，请求出错了，请稍后重试。";
      onMessagesUpdate([...updatedMessages, { role: "assistant", content: errorMsg }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (messages.length === 0) {
    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">有什么可以帮你的？</h3>
            <p className="text-gray-400 text-sm">开始对话，查询你的课表信息</p>
          </div>
        </div>
        <ChatInput onSend={handleSend} disabled={isLoading} />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-3xl mx-auto">
          {messages.map((msg, i) => (
            <MessageBubble key={i} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <div className="flex justify-start mb-4">
              <div className="bg-[#1e1e1e] border border-gray-800 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatInput onSend={handleSend} disabled={isLoading} />
    </div>
  );
}
```

---

### Task 15: Create ScheduleView component

**Files:**
- Create: `components/ScheduleView.tsx`

- [ ] **Step 1: Write ScheduleView**

Write `components/ScheduleView.tsx`:
```typescript
"use client";

import { useEffect, useState } from "react";
import { Course, DAY_LABELS, COURSE_COLORS } from "@/types";

export default function ScheduleView() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/schedule")
      .then((r) => r.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const getColor = (name: string) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/schedule/${id}`, { method: "DELETE" });
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  const days = [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6">课程表</h2>
      <div className="space-y-6 max-w-3xl">
        {days.map((day) => {
          const dayCourses = courses
            .filter((c) => c.day === day)
            .sort((a, b) => a.startTime.localeCompare(b.startTime));

          if (dayCourses.length === 0) return null;

          return (
            <div key={day}>
              <h3 className="text-lg font-semibold text-gray-300 mb-3 sticky top-0 bg-[#0f0f0f] py-2">
                {DAY_LABELS[day]}
              </h3>
              <div className="space-y-3">
                {dayCourses.map((course) => (
                  <div
                    key={course.id}
                    className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-4 flex items-start gap-4 group hover:border-gray-700 transition-colors"
                  >
                    <div
                      className="w-1 h-full min-h-[60px] rounded-full shrink-0"
                      style={{ backgroundColor: getColor(course.name) }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-100">{course.name}</h4>
                        <span className="text-xs text-gray-500">
                          第{course.weeks[0]}-{course.weeks[course.weeks.length - 1]}周
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
                        <span>
                          {course.startTime} - {course.endTime}
                        </span>
                        <span>{course.location}</span>
                        <span>{course.teacher}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 shrink-0 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {courses.length === 0 && (
          <p className="text-gray-500 text-center py-20">暂无课程，点击侧边栏"添加课程"开始</p>
        )}
      </div>
    </div>
  );
}
```

---

### Task 16: Create AddCourseView component

**Files:**
- Create: `components/AddCourseView.tsx`

- [ ] **Step 1: Write AddCourseView**

Write `components/AddCourseView.tsx`:
```typescript
"use client";

import { useState } from "react";

interface Props {
  onAdded?: () => void;
}

export default function AddCourseView({ onAdded }: Props) {
  const [form, setForm] = useState({
    name: "",
    day: 1,
    startTime: "08:00",
    endTime: "09:40",
    location: "",
    teacher: "",
    weekStart: 1,
    weekEnd: 16,
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    const weeks = Array.from(
      { length: form.weekEnd - form.weekStart + 1 },
      (_, i) => form.weekStart + i
    );

    await fetch("/api/schedule", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        day: form.day,
        startTime: form.startTime,
        endTime: form.endTime,
        location: form.location,
        teacher: form.teacher,
        weeks,
      }),
    });

    setSubmitting(false);
    setSuccess(true);
    setForm({ name: "", day: 1, startTime: "08:00", endTime: "09:40", location: "", teacher: "", weekStart: 1, weekEnd: 16 });
    setTimeout(() => setSuccess(false), 3000);
    onAdded?.();
  };

  const days = [
    { value: 1, label: "周一" },
    { value: 2, label: "周二" },
    { value: 3, label: "周三" },
    { value: 4, label: "周四" },
    { value: 5, label: "周五" },
    { value: 6, label: "周六" },
    { value: 7, label: "周日" },
  ];

  const inputClass =
    "w-full bg-[#1e1e1e] border border-gray-700 rounded-lg px-3 py-2 text-sm text-gray-200 placeholder-gray-500 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500";
  const labelClass = "block text-sm text-gray-400 mb-1.5";

  return (
    <div className="h-full overflow-y-auto p-6">
      <h2 className="text-2xl font-bold mb-6">添加课程</h2>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4">
        <div>
          <label className={labelClass}>课程名称</label>
          <input
            type="text"
            className={inputClass}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="例如：高等数学"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>星期</label>
            <select
              className={inputClass}
              value={form.day}
              onChange={(e) => setForm({ ...form, day: Number(e.target.value) })}
            >
              {days.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>教师</label>
            <input
              type="text"
              className={inputClass}
              value={form.teacher}
              onChange={(e) => setForm({ ...form, teacher: e.target.value })}
              placeholder="例如：张老师"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>开始时间</label>
            <input
              type="time"
              className={inputClass}
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
              required
            />
          </div>
          <div>
            <label className={labelClass}>结束时间</label>
            <input
              type="time"
              className={inputClass}
              value={form.endTime}
              onChange={(e) => setForm({ ...form, endTime: e.target.value })}
              required
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>上课地点</label>
          <input
            type="text"
            className={inputClass}
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="例如：教学楼A301"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>起始周</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={20}
              value={form.weekStart}
              onChange={(e) => setForm({ ...form, weekStart: Number(e.target.value) })}
            />
          </div>
          <div>
            <label className={labelClass}>结束周</label>
            <input
              type="number"
              className={inputClass}
              min={1}
              max={20}
              value={form.weekEnd}
              onChange={(e) => setForm({ ...form, weekEnd: Number(e.target.value) })}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {submitting ? "添加中..." : "添加课程"}
        </button>

        {success && (
          <p className="text-emerald-400 text-sm text-center">课程添加成功！</p>
        )}
      </form>
    </div>
  );
}
```

---

### Task 17: Create App layout and main page

**Files:**
- Create: `app/app/layout.tsx`
- Modify: `app/app/page.tsx`

- [ ] **Step 1: Write app layout**

Write `app/app/layout.tsx`:
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 课表助手 - 应用",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

- [ ] **Step 2: Write main app page with view switching**

Write `app/app/page.tsx`:
```typescript
"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation, Message, ViewType } from "@/types";
import Sidebar from "@/components/Sidebar";
import WelcomeView from "@/components/WelcomeView";
import ChatView from "@/components/ChatView";
import ScheduleView from "@/components/ScheduleView";
import AddCourseView from "@/components/AddCourseView";

const STORAGE_KEY = "schedule-assistant-conversations";

function loadConversations(): Conversation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveConversations(convs: Conversation[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
}

export default function AppPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("welcome");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setConversations(loadConversations());
    setMounted(true);
  }, []);

  const activeConv = conversations.find((c) => c.id === activeConvId) || null;

  const handleNewChat = useCallback(() => {
    const newConv: Conversation = {
      id: Date.now().toString(),
      title: "新对话",
      messages: [],
      createdAt: new Date().toISOString(),
    };
    const updated = [newConv, ...conversations];
    setConversations(updated);
    setActiveConvId(newConv.id);
    setCurrentView("chat");
    saveConversations(updated);
  }, [conversations]);

  const handleSelectConv = useCallback((id: string) => {
    setActiveConvId(id);
    setCurrentView("chat");
  }, []);

  const handleDeleteConv = useCallback(
    (id: string) => {
      const updated = conversations.filter((c) => c.id !== id);
      setConversations(updated);
      if (activeConvId === id) {
        setActiveConvId(null);
        setCurrentView("welcome");
      }
      saveConversations(updated);
    },
    [conversations, activeConvId]
  );

  const handleMessagesUpdate = useCallback(
    (messages: Message[]) => {
      if (!activeConvId) return;
      const updated = conversations.map((c) => {
        if (c.id !== activeConvId) return c;
        const title =
          messages.length > 0 && messages[0].role === "user"
            ? messages[0].content.slice(0, 20) + (messages[0].content.length > 20 ? "..." : "")
            : c.title;
        return { ...c, messages, title };
      });
      setConversations(updated);
      saveConversations(updated);
    },
    [conversations, activeConvId]
  );

  const handleViewChange = useCallback((view: ViewType) => {
    setCurrentView(view);
    if (view === "chat" && !activeConvId) {
      handleNewChat();
    }
  }, [activeConvId, handleNewChat]);

  const handleWelcomeStart = useCallback(() => {
    if (!activeConvId) {
      handleNewChat();
    } else {
      setCurrentView("chat");
    }
  }, [activeConvId, handleNewChat]);

  if (!mounted) return null;

  const renderMainContent = () => {
    switch (currentView) {
      case "chat":
        return (
          <ChatView
            messages={activeConv?.messages || []}
            onMessagesUpdate={handleMessagesUpdate}
          />
        );
      case "schedule":
        return <ScheduleView />;
      case "add-course":
        return <AddCourseView />;
      default:
        return <WelcomeView onStart={handleWelcomeStart} />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        conversations={conversations}
        activeConvId={activeConvId}
        currentView={currentView}
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        onDeleteConv={handleDeleteConv}
        onViewChange={handleViewChange}
      />
      <main className="flex-1 min-w-0 bg-[#0f0f0f]">{renderMainContent()}</main>
    </div>
  );
}
```

---

### Task 18: Config file cleanup and final checks

**Files:**
- Modify: `next.config.mjs` (ensure image config if needed)
- Check: Remove default Vercel/Next.js boilerplate if present

- [ ] **Step 1: Clean default boilerplate**

Check if `app/page.tsx` already has content, if so it's already overwritten. Check for any remaining default CSS or page files that should be removed.

Run:
```bash
ls "C:/Users/lenovo/Desktop/新建文件夹/app"
```

Expected: Only our files present (globals.css, layout.tsx, page.tsx, api/, app/, components/, data/, lib/, types/)

- [ ] **Step 2: Start dev server and test**

Run:
```bash
cd "C:/Users/lenovo/Desktop/新建文件夹" && npm run dev
```

Open http://localhost:3000 and verify:
1. Landing page renders with Hero, Features, Footer
2. Click "开始使用" navigates to /app
3. Sidebar shows with nav links
4. "添加课程" form works
5. "查看课表" shows courses
6. Chat sends message (requires ANTHROPIC_API_KEY set)

---

### Task 19: Add AI model switching support

This task is optional — only run if the user confirms.

**Files:**
- Modify: `.env.local`
- Modify: `lib/anthropic.ts`

- [ ] **Step 1: Add model env var**

Update `.env.local`:
```
ANTHROPIC_API_KEY=your-api-key-here
ANTHROPIC_MODEL=claude-sonnet-4-6
```

- [ ] **Step 2: Update client to use configurable model**

Update `lib/anthropic.ts` SYSTEM_PROMPT export and add model helper:

```typescript
export function getModel(): string {
  return process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6";
}
```

Update `app/api/chat/route.ts` to use `getModel()` instead of hardcoded string:
```typescript
model: getModel(),
```
