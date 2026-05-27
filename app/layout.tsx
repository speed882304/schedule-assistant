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
      <body className="min-h-screen text-gray-200 antialiased">
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 0,
            backgroundImage: "url('/bg.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 1,
            backgroundColor: "rgba(15, 15, 15, 0.4)",
          }}
        />
        <div style={{ position: "relative", zIndex: 10 }}>{children}</div>
      </body>
    </html>
  );
}
