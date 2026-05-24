import { AboutContent } from "@/components/AboutContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "About",
  description:
    "Meet the team behind Why So Serious Comedy — English stand-up comedy in Tokyo, Kinshicho. Founders, creative direction, and the story of the room.",
  path: "/about",
});

export default function AboutPage() {
  return <AboutContent />;
}
