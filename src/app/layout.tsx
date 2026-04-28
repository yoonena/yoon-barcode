import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "바코드 생성기",
  description: "값을 입력하면 실시간으로 바코드가 생성되는 간단한 웹앱",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/variable/pretendardvariable.css"
        />
      </head>
      <body className="min-h-screen flex flex-col bg-zinc-50 dark:bg-black">{children}</body>
    </html>
  );
}
