import { MerchContent } from "@/components/MerchContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "Merch — WSSC MCGA Cap",
  description:
    "Shop the ¥3,980 Why So Serious Comedy cap. Black six-panel construction with front and back embroidery, photographed in Tokyo.",
  path: "/merch",
});

export default function MerchPage() {
  return <MerchContent />;
}
