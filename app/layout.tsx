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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="课表助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                navigator.serviceWorker.register("/sw.js");
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
