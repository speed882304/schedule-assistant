interface Props {
  onStart: () => void;
}

export default function WelcomeView({ onStart }: Props) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-6">
      <div className="mb-6">
        <svg className="w-16 h-16 text-blue-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
            d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold mb-3">欢迎使用 AI 课表助手</h2>
      <p className="text-gray-400 mb-8 max-w-md">
        你可以直接和我对话查询课表，或点击侧边栏查看完整课表和添加课程。
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        {["我明天有什么课？", "高等数学在哪里上？", "帮我整理一周课表"].map((q) => (
          <button
            key={q}
            onClick={onStart}
            className="px-4 py-2 rounded-xl border border-gray-700 text-sm text-gray-300 hover:bg-[#1f1f1f] hover:border-gray-600 transition-colors"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
