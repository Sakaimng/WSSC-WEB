import type { Metadata } from "next";
import {
  EVENTBRITE_TICKETS_URL,
  EXTERNAL_TICKETS_URL,
  GOOGLE_MAPS_URL,
  INSTAGRAM_URL,
  VENUE_ADDRESS,
} from "@/lib/config";

export const SITE_NAME = "Why So Serious Comedy";

/** Canonical production domain — https://www.wsscomedy.com/ */
export const SITE_URL = "https://www.wsscomedy.com";

export const VENUE_NAME = "Moxy Tokyo Kinshicho";

export const SEO_KEYWORDS = [
  "comedy",
  "tokyo comedy",
  "tokyo",
  "kinshicho",
  "stand up comedy",
  "stand-up comedy",
  "best comedy in tokyo",
  "english comedy tokyo",
  "english stand-up comedy tokyo",
  "why so serious comedy",
  "kinshicho comedy",
  "sumida comedy",
  "live comedy tokyo",
  "comedy club tokyo",
  "moxy kinshicho",
] as const;

export const DEFAULT_DESCRIPTION =
  "Why So Serious Comedy — English stand-up comedy in Tokyo at Moxy Kinshicho. One of the best comedy nights in Kinshicho and Sumida. See upcoming shows, photos, and get tickets.";

/** Override with `NEXT_PUBLIC_SITE_URL` if needed; otherwise uses SITE_URL in production. */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (explicit) return explicit;
  if (process.env.NODE_ENV === "production") return SITE_URL;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

const OG_IMAGE_PATH = "/hero/home-hero.jpg";

const sharedOpenGraph = {
  type: "website" as const,
  locale: "en_US",
  siteName: SITE_NAME,
  images: [
    {
      url: OG_IMAGE_PATH,
      alt: "Stand-up comedy audience at Why So Serious Comedy in Tokyo, Kinshicho",
    },
  ],
};

type PageMetaOptions = {
  title: string;
  description: string;
  /** Path including leading slash, e.g. `/schedule` */
  path: string;
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetaOptions): Metadata {
  const canonical = path === "/" ? getSiteUrl() : `${getSiteUrl()}${path}`;

  return {
    title,
    description,
    keywords: [...SEO_KEYWORDS],
    alternates: { canonical },
    openGraph: {
      ...sharedOpenGraph,
      url: canonical,
      title,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE_PATH],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default:
      "Why So Serious Comedy | Stand-Up Comedy in Tokyo, Kinshicho",
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: [...SEO_KEYWORDS],
  applicationName: SITE_NAME,
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    ...sharedOpenGraph,
    url: getSiteUrl(),
    title: "Why So Serious Comedy | Stand-Up Comedy in Tokyo, Kinshicho",
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Why So Serious Comedy | Stand-Up Comedy in Tokyo, Kinshicho",
    description: DEFAULT_DESCRIPTION,
    images: [OG_IMAGE_PATH],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

/** Schema.org ComedyClub — home / sitewide */
export const comedyClubJsonLd = {
  "@context": "https://schema.org",
  "@type": "ComedyClub",
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: getSiteUrl(),
  image: `${getSiteUrl()}${OG_IMAGE_PATH}`,
  address: {
    "@type": "PostalAddress",
    streetAddress: "3-4-2 Kotobashi, Sumida-ku",
    addressLocality: "Tokyo",
    addressRegion: "Tokyo",
    postalCode: "130-0022",
    addressCountry: "JP",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 35.696,
    longitude: 139.814,
  },
  areaServed: {
    "@type": "City",
    name: "Tokyo",
  },
  keywords: SEO_KEYWORDS.join(", "),
  sameAs: [
    INSTAGRAM_URL,
    GOOGLE_MAPS_URL,
    EXTERNAL_TICKETS_URL,
    EVENTBRITE_TICKETS_URL,
  ],
  location: {
    "@type": "Place",
    name: VENUE_NAME,
    address: VENUE_ADDRESS,
  },
};
