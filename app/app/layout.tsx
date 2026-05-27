import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI 课表助手 - 应用",
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
