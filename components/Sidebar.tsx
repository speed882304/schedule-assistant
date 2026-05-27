"use client";

import { Conversation, ViewType } from "@/types";
import ConversationList from "./ConversationList";
import Link from "next/link";

interface Props {
  conversations: Conversation[];
  activeConvId: string | null;
  currentView: ViewType;
  currentWeek: number;
  onNewChat: () => void;
  onSelectConv: (id: string) => void;
  onDeleteConv: (id: string) => void;
  onViewChange: (view: ViewType) => void;
  onWeekChange: (week: number) => void;
}

export default function Sidebar({
  conversations,
  activeConvId,
  currentView,
  currentWeek,
  onNewChat,
  onSelectConv,
  onDeleteConv,
  onViewChange,
  onWeekChange,
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
      <div className="p-4 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AI 课表助手
          </span>
        </Link>
      </div>

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

      <div className="flex-1 overflow-y-auto px-2 py-1">
        <p className="text-xs text-gray-500 px-3 py-2 uppercase tracking-wider">对话历史</p>
        <ConversationList
          conversations={conversations}
          activeId={activeConvId}
          onSelect={onSelectConv}
          onDelete={onDeleteConv}
        />
      </div>

      <div className="border-t border-gray-800 p-3">
        <p className="text-xs text-gray-500 px-1 py-1 uppercase tracking-wider">当前周次</p>
        <div className="flex items-center gap-1 mt-1">
          <button
            onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
            disabled={currentWeek <= 1}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex-1 text-center">
            <span className="text-lg font-semibold text-gray-100">第 {currentWeek} 周</span>
          </div>
          <button
            onClick={() => onWeekChange(Math.min(20, currentWeek + 1))}
            disabled={currentWeek >= 20}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

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
