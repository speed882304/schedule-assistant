"use client";

import { useState, useRef, useEffect } from "react";
import { Message } from "@/types";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { loadSchedule } from "@/lib/schedule-client";

const API_URL = process.env.NEXT_PUBLIC_CHAT_API_URL || "/api/chat";
const IS_WORKER = !!process.env.NEXT_PUBLIC_CHAT_API_URL;

interface Props {
  messages: Message[];
  onMessagesUpdate: (messages: Message[]) => void;
  currentWeek: number;
}

export default function ChatView({ messages, onMessagesUpdate, currentWeek }: Props) {
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

    const buildBody = () => {
      if (IS_WORKER) {
        const courses = loadSchedule();
        const weekCourses = courses.filter((c) => c.weeks.includes(currentWeek));
        return JSON.stringify({
          messages: updatedMessages,
          scheduleData: JSON.stringify(weekCourses),
          weekHint: `当前是第 ${currentWeek} 周。`,
        });
      }
      return JSON.stringify({ messages: updatedMessages, currentWeek });
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: buildBody(),
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
