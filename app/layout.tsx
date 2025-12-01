import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "번역 시험 플랫폼",
  description: "번역 시험 응시자 마이페이지",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
