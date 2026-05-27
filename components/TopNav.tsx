"use client";

import { useState, useRef, useEffect } from "react";
import { Conversation, ViewType } from "@/types";

interface Props {
  conversations: Conversation[];
  activeConvId: string | null;
  currentView: ViewType;
  currentWeek: number;
  autoWeek: number;
  onNewChat: () => void;
  onSelectConv: (id: string) => void;
  onDeleteConv: (id: string) => void;
  onViewChange: (view: ViewType) => void;
  onWeekChange: (week: number) => void;
}

export default function TopNav({
  conversations,
  activeConvId,
  currentView,
  currentWeek,
  autoWeek,
  onNewChat,
  onSelectConv,
  onDeleteConv,
  onViewChange,
  onWeekChange,
}: Props) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setHistoryOpen(false);
      }
    }
    if (historyOpen) {
      document.addEventListener("mousedown", handleClick);
      return () => document.removeEventListener("mousedown", handleClick);
    }
  }, [historyOpen]);

  const navItems: { view: ViewType; label: string }[] = [
    { view: "chat", label: "AI 对话" },
    { view: "schedule", label: "查看课表" },
    { view: "add-course", label: "添加课程" },
  ];

  return (
    <>
      <nav className="h-12 flex items-center bg-[#171717] border-b border-gray-800 px-3 gap-2 shrink-0 relative z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg text-gray-400 hover:bg-[#1f1f1f]"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent whitespace-nowrap">
          AI 课表助手
        </span>

        <div className="hidden md:flex items-center gap-1 ml-4">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => onViewChange(item.view)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                currentView === item.view
                  ? "bg-[#2a2a2a] text-gray-100"
                  : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex-1" />

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={onNewChat}
            className="px-3 py-1.5 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-[#1f1f1f] transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            新对话
          </button>

          <div className="relative" ref={historyRef}>
            <button
              onClick={() => setHistoryOpen(!historyOpen)}
              className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              历史
              <svg
                className={`w-3 h-3 transition-transform ${historyOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {historyOpen && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-[#1a1a1a] border border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {conversations.length === 0 ? (
                  <p className="text-gray-500 text-sm px-3 py-4 text-center">暂无对话记录</p>
                ) : (
                  <div className="py-1">
                    {conversations.map((conv) => (
                      <div
                        key={conv.id}
                        className={`group flex items-center justify-between px-3 py-2 cursor-pointer text-sm transition-colors ${
                          activeConvId === conv.id
                            ? "bg-[#2a2a2a] text-gray-100"
                            : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
                        }`}
                        onClick={() => {
                          onSelectConv(conv.id);
                          setHistoryOpen(false);
                        }}
                      >
                        <span className="truncate flex-1 text-xs">{conv.title}</span>
                        <button
                          className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-1 shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteConv(conv.id);
                          }}
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-0.5">
          <button
            onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
            disabled={currentWeek <= 1}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-sm font-semibold text-gray-100 min-w-[3.5rem] text-center">
            第{currentWeek}周
          </span>
          <button
            onClick={() => onWeekChange(Math.min(20, currentWeek + 1))}
            disabled={currentWeek >= 20}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {currentWeek !== autoWeek && (
          <button
            onClick={() => onWeekChange(autoWeek)}
            className="hidden md:block text-xs text-blue-400 hover:text-blue-300 transition-colors whitespace-nowrap"
          >
            回到本周
          </button>
        )}
      </nav>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed top-0 left-0 bottom-0 w-72 bg-[#171717] z-50 md:hidden flex flex-col overflow-y-auto">
            <div className="p-3 border-b border-gray-800 flex items-center justify-between">
              <span className="text-base font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI 课表助手
              </span>
              <button
                onClick={() => setMobileOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f]"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-3">
              <button
                onClick={() => { onNewChat(); setMobileOpen(false); }}
                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-gray-700 text-sm text-gray-300 hover:bg-[#1f1f1f] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                新对话
              </button>
            </div>

            <div className="px-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.view}
                  onClick={() => { onViewChange(item.view); setMobileOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                    currentView === item.view
                      ? "bg-[#2a2a2a] text-gray-100"
                      : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex-1 px-2 py-3 min-h-0">
              <p className="text-xs text-gray-500 px-3 py-1 uppercase tracking-wider">对话历史</p>
              <div className="space-y-0.5 mt-1">
                {conversations.length === 0 ? (
                  <p className="text-gray-500 text-sm px-3 py-2">暂无对话记录</p>
                ) : (
                  conversations.map((conv) => (
                    <div
                      key={conv.id}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors ${
                        activeConvId === conv.id
                          ? "bg-[#2a2a2a] text-gray-100"
                          : "text-gray-400 hover:bg-[#1f1f1f] hover:text-gray-200"
                      }`}
                      onClick={() => { onSelectConv(conv.id); setMobileOpen(false); }}
                    >
                      <span className="truncate flex-1">{conv.title}</span>
                      <button
                        className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 ml-1 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConv(conv.id);
                        }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="border-t border-gray-800 px-3 py-3">
              <p className="text-xs text-gray-500 px-1 uppercase tracking-wider">当前周次</p>
              <div className="flex items-center gap-1 mt-2">
                <button
                  onClick={() => onWeekChange(Math.max(1, currentWeek - 1))}
                  disabled={currentWeek <= 1}
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] disabled:opacity-30"
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
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-[#1f1f1f] disabled:opacity-30"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {currentWeek !== autoWeek && (
                <button
                  onClick={() => { onWeekChange(autoWeek); }}
                  className="w-full mt-2 text-xs text-blue-400 hover:text-blue-300 transition-colors py-1"
                >
                  回到本周（第 {autoWeek} 周）
                </button>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}
