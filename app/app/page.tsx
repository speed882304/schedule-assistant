"use client";

import { useState, useEffect, useCallback } from "react";
import { Conversation, Message, ViewType } from "@/types";
import TopNav from "@/components/TopNav";
import WelcomeView from "@/components/WelcomeView";
import ChatView from "@/components/ChatView";
import ScheduleView from "@/components/ScheduleView";
import AddCourseView from "@/components/AddCourseView";

const STORAGE_KEY = "schedule-assistant-conversations";
const WEEK_KEY = "schedule-assistant-current-week";
const SEMESTER_START = new Date("2026-03-02");

function getCurrentWeek(): number {
  const now = new Date();
  const diff = now.getTime() - SEMESTER_START.getTime();
  const week = Math.floor(diff / (7 * 24 * 60 * 60 * 1000)) + 1;
  return Math.max(1, Math.min(20, week));
}

function loadWeek(): number {
  if (typeof window === "undefined") return getCurrentWeek();
  try {
    const raw = localStorage.getItem(WEEK_KEY);
    if (raw) return parseInt(raw, 10);
  } catch {}
  return getCurrentWeek();
}

function saveWeek(week: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(WEEK_KEY, String(week));
}

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
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(convs));
}

export default function AppPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<ViewType>("welcome");
  const [currentWeek, setCurrentWeek] = useState(() => loadWeek());

  const handleWeekChange = useCallback((week: number) => {
    setCurrentWeek(week);
    saveWeek(week);
  }, []);

  useEffect(() => {
    const saved = loadConversations();
    if (saved.length > 0) {
      setConversations(saved);
    }
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

  return (
    <div className="flex flex-col h-screen">
      <TopNav
        conversations={conversations}
        activeConvId={activeConvId}
        currentView={currentView}
        currentWeek={currentWeek}
        autoWeek={getCurrentWeek()}
        onNewChat={handleNewChat}
        onSelectConv={handleSelectConv}
        onDeleteConv={handleDeleteConv}
        onViewChange={handleViewChange}
        onWeekChange={handleWeekChange}
      />
      <main className="flex-1 min-h-0 bg-[#0f0f0f]">
        {currentView === "chat" && (
          <ChatView
            messages={activeConv?.messages || []}
            onMessagesUpdate={handleMessagesUpdate}
            currentWeek={currentWeek}
          />
        )}
        {currentView === "schedule" && <ScheduleView currentWeek={currentWeek} />}
        {currentView === "add-course" && <AddCourseView />}
        {currentView === "welcome" && <WelcomeView onStart={handleWelcomeStart} />}
      </main>
    </div>
  );
}
