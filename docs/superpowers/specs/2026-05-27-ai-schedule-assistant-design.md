# AI 课表助手 — 设计方案

## 概述

基于 Next.js 的 AI 课表助手网站，深色风格、ChatGPT 式 UI，支持 AI 聊天、查看课表、添加课程。

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **AI**: Claude API (Anthropic SDK)
- **数据存储**: 本地 JSON 文件（`data/schedule.json`）
- **API Key**: `.env.local` 环境变量，服务端调用

## 页面结构

### `/` — Landing 首页

产品介绍页，包含：
- Hero 区域：标题、副标题、CTA 按钮（"开始使用"跳转到 `/app`）
- 功能介绍区：AI 对话、课表管理、智能提醒 三个功能卡片
- Footer

### `/app` — 主应用页（侧边栏布局）

侧边栏 + 主内容区的布局，侧边栏固定宽度 ~260px，主内容区自适应。

**侧边栏：**
- Logo + 应用名称
- "新对话" 按钮
- 对话历史列表（可滚动）
- 导航链接：查看课表、添加课程
- 底部：设置图标

**主内容区（视图切换，非路由跳转）：**
1. 欢迎视图：首次进入显示欢迎信息和引导
2. AI 聊天视图：ChatGPT 风格对话界面
3. 课表视图：按天分组展示课程卡片
4. 添加课程视图：表单页面

## 数据结构

### 课表 JSON (`data/schedule.json`)

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
    "weeks": [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16]
  }
]
```

- `day`: 1-7 表示周一至周日
- `weeks`: 上课周次数组

### 对话历史

存储在浏览器 LocalStorage，结构：
```json
[
  {
    "id": "uuid",
    "title": "对话标题",
    "messages": [
      { "role": "user", "content": "..." },
      { "role": "assistant", "content": "..." }
    ],
    "createdAt": "ISO timestamp"
  }
]
```

## API 设计

### `POST /api/chat`

发送消息给 Claude API，返回流式响应。

- **Request**: `{ messages: [...], conversationId: string }`
- **Response**: Server-Sent Events 流式输出
- System Prompt 中注入当前课表 JSON 作为上下文，确保 AI 能准确回答课表问题

### `GET /api/schedule`

读取并返回 `data/schedule.json` 内容。

### `POST /api/schedule`

新增课程到 `data/schedule.json`。

- **Request**: `{ name, day, startTime, endTime, location, teacher, weeks }`
- **Response**: 新增后的课程对象

### `DELETE /api/schedule/[id]`

删除指定课程。

## 组件树

```
Layout
├── Landing (/)
│   ├── Hero
│   ├── Features
│   └── Footer
│
└── AppLayout (/app)
    ├── Sidebar
    │   ├── Logo
    │   ├── NewChatButton
    │   ├── ConversationList
    │   ├── NavLinks (查看课表 / 添加课程)
    │   └── SettingsIcon
    │
    └── MainContent
        ├── WelcomeView
        ├── ChatView
        │   ├── MessageList
        │   │   ├── UserBubble
        │   │   └── AIBubble
        │   └── ChatInput
        ├── ScheduleView
        │   ├── DayTabs
        │   └── CourseCard[]
        └── AddCourseView
            └── CourseForm
```

## 视觉设计

深色主题配色：

| 用途 | Tailwind Class / Hex |
|------|---------------------|
| 主背景 | `bg-[#0f0f0f]` / `#0f0f0f` |
| 侧边栏 | `bg-[#171717]` / `#171717` |
| 卡片/气泡 | `bg-[#1e1e1e]` / `#1e1e1e` |
| 用户气泡 | `bg-[#2b3d5c]` / `#2b3d5c` |
| 主文字 | `text-gray-200` / `#e0e0e0` |
| 次要文字 | `text-gray-400` / `#9ca3af` |
| 强调色 | `text-blue-400` / `#60a5fa` |
| 边框 | `border-gray-800` |

- 字体：系统默认 sans-serif
- 聊天气泡：圆角矩形，用户右对齐深蓝，AI 左对齐深灰
- 课表卡片：深色底 + 左侧彩色竖条区分不同课程
- 支持 Markdown 渲染 AI 回复

## 课程卡颜色方案

8 种颜色循环分配给不同课程：
`#60a5fa` `#f472b6` `#34d399` `#fbbf24` `#a78bfa` `#fb923c` `#38bdf8` `#f87171`

## AI System Prompt 策略

System Prompt 中注入课表数据，指导 AI：
- 准确回答课表相关问题
- 当用户想添加课程时，收集完信息后引导用户去"添加课程"页面
- 用友好、简洁的中文回复

## 关键交互

1. 用户在聊天中询问课表 → AI 基于注入的 JSON 数据准确回答
2. 用户在聊天中要求添加课程 → AI 收集信息后提示用户切换到添加课程视图
3. 侧边栏导航点击 → 主内容区切换视图，保留当前聊天状态
4. 新对话 → 清空当前对话，创建新会话
5. 对话历史 → 点击切换历史对话
