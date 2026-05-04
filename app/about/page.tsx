import type { Metadata } from "next";
import { AboutContent } from "@/components/AboutContent";

export const metadata: Metadata = {
  title: "About",
  description: "The story behind Why So Serious Comedy.",
};

export default function AboutPage() {
  return <AboutContent />;
}
