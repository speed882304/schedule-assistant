import { NextRequest } from "next/server";
import { getAnthropicClient, SYSTEM_PROMPT } from "@/lib/anthropic";
import { readSchedule } from "@/lib/schedule";
import { Message } from "@/types";

export async function POST(request: NextRequest) {
  const { messages, currentWeek } = (await request.json()) as {
    messages: Message[];
    currentWeek?: number;
  };

  const allCourses = readSchedule();
  const weekCourses = currentWeek
    ? allCourses.filter((c) => c.weeks.includes(currentWeek))
    : allCourses;
  const scheduleData = JSON.stringify(weekCourses, null, 2);
  const weekHint = currentWeek ? `\n当前是第 ${currentWeek} 周。` : "";
  const systemPrompt = SYSTEM_PROMPT.replace("{SCHEDULE_DATA}", scheduleData).replace(
    "{WEEK_HINT}",
    weekHint
  );

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
