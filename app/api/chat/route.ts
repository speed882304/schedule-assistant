import { NextRequest } from "next/server";
import { getDeepSeekClient, SYSTEM_PROMPT } from "@/lib/deepseek";
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

  const deepseekMessages = [
    { role: "system" as const, content: systemPrompt },
    ...messages.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
  ];

  const stream = await getDeepSeekClient().chat.completions.create({
    model: "deepseek-chat",
    max_tokens: 2048,
    messages: deepseekMessages,
    stream: true,
  });

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const text = chunk.choices[0]?.delta?.content;
        if (text) {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ delta: { text } })}\n\n`)
          );
        }
      }
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
