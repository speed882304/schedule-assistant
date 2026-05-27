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
