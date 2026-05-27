import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI 课表助手",
  description: "智能管理你的课程表，随时随地查询课表信息",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" className="dark">
      <body className="min-h-screen bg-[#0f0f0f] text-gray-200 antialiased">
        {children}
      </body>
    </html>
  );
}
