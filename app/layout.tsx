import type { Metadata } from "next";
import PagePreloader from "@/components/PagePreloader";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Why So Serious Comedy",
    template: "%s | Why So Serious Comedy",
  },
  description:
    "Stand-up comedy club: shows, gallery, and tickets. Why So Serious Comedy.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-black font-sans antialiased">
      <body className="flex min-h-full flex-col bg-black font-sans text-white">
        <PagePreloader />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
