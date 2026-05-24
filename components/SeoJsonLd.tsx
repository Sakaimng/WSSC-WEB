import { comedyClubJsonLd } from "@/lib/seo";

export function SeoJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(comedyClubJsonLd) }}
    />
  );
}
