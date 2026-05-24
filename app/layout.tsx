import { LanguageProvider } from "@/components/LanguageProvider";
import PagePreloader from "@/components/PagePreloader";
import { PageTransition } from "@/components/PageTransition";
import { SeoJsonLd } from "@/components/SeoJsonLd";
import { SmoothScroll } from "@/components/SmoothScroll";
import { rootMetadata } from "@/lib/seo";
import "./globals.css";

export const metadata = {
  ...rootMetadata,
  icons: {
    icon: "/FAVICON/Vector%20(1).svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-black font-sans antialiased">
      <body className="flex min-h-[100dvh] flex-col bg-black font-sans text-white">
        <SeoJsonLd />
        <LanguageProvider>
          <SmoothScroll />
          <PagePreloader />
          <PageTransition>{children}</PageTransition>
        </LanguageProvider>
      </body>
    </html>
  );
}
