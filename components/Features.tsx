const features = [
  {
    icon: (
      <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    title: "AI 智能对话",
    desc: "像聊天一样查询课表，明天有什么课？数学课在哪上？AI 即时回答。",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    title: "课表可视化",
    desc: "一周课程一目了然，按天分组卡片展示，彩色标签区分不同课程。",
  },
  {
    icon: (
      <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "轻松添加课程",
    desc: "填写课程信息一键添加，支持课程名、时间、地点、教师、周次。",
  },
];

export default function Features() {
  return (
    <section className="max-w-4xl mx-auto px-4 py-20">
      <h2 className="text-3xl font-bold text-center mb-14">核心功能</h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 hover:border-gray-700 transition-colors"
          >
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
