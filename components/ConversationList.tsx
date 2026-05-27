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
