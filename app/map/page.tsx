import { MapPageContent } from "@/components/MapPageContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Map",
  description:
    "Find Why So Serious Comedy at Moxy Tokyo Kinshicho — English stand-up in Tokyo. Interactive location map centered on Kinshicho, Sumida.",
  path: "/map",
});

export default function MapPage() {
  return <MapPageContent />;
}
