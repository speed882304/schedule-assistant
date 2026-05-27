import { Message } from "@/types";

interface Props {
  message: Message;
}

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-[#2b3d5c] text-gray-100 rounded-br-md"
            : "bg-[#1e1e1e] text-gray-200 rounded-bl-md border border-gray-800"
        }`}
      >
        {isUser ? (
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
        ) : (
          <div
            className="markdown-content text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatMarkdown(message.content) }}
          />
        )}
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  const html = text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/\n/g, "<br/>");
  return html;
}
