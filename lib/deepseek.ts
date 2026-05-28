import OpenAI from "openai";

let client: OpenAI | null = null;

export function getDeepSeekClient(): OpenAI {
  if (!client) {
    client = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY || "",
      baseURL: "https://api.deepseek.com",
    });
  }
  return client;
}

export const SYSTEM_PROMPT = `你是一个 AI 课表助手。你可以帮助用户查看课表、了解课程安排。

## 课表数据
当前课表如下（仅显示当前周的课程）：
{SCHEDULE_DATA}
{WEEK_HINT}

## 你的职责
1. 回答所有课表相关问题（明天有什么课、某个课程在哪里上、什么时间上课等）
2. 当用户想添加新课程时，收集以下信息：课程名称、星期几(1-7)、开始时间、结束时间、上课地点、授课教师、周次范围。收集完后引导用户点击侧边栏的"添加课程"手动添加。
3. 用友好、简洁、有帮助的方式回复。
4. 如果用户问与课表无关的问题，可以简单回应，但引导回课表相关话题。

请用中文回复。`;
