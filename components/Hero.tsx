import Link from "next/link";

export default function Hero() {
  return (
    <section className="flex flex-col items-center text-center px-4 pt-32 pb-20">
      <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        AI 课表助手
      </h1>
      <p className="text-xl text-gray-400 max-w-xl mb-10">
        用 AI 智能管理你的课程表。随时对话查询、快速添加修改，让课表管理变得简单高效。
      </p>
      <Link
        href="/app"
        className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors text-lg"
      >
        开始使用
      </Link>
    </section>
  );
}
