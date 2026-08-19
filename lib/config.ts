import { WSSC_MAP_STYLE_ID, WSSC_MAP_STYLE_PATH } from "@/lib/wssc-map-style";

/**
 * Replace with your real ticketing provider URL when ready.
 */
export const EXTERNAL_TICKETS_URL =
  process.env.NEXT_PUBLIC_EXTERNAL_TICKETS_URL ??
  "https://www.meetup.com/why-so-serious-comedy/";

export const EVENTBRITE_TICKETS_URL =
  "https://www.eventbrite.com/e/why-so-serious-comedy-stand-up-comedy-in-english-tickets-1889172488769?aff=erelpanelorg&utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGn-RdwSVqMOd-3X5bClsrGqGKfonkYnEM6R5U78KdSzw1cwfQSr8n4ifC9jJI_aem_kbLFCadW34AtcH9Emah11A";

export const INSTAGRAM_URL = "https://www.instagram.com/wsscomedy/";

export const MERCH_CONTACT_URL =
  "https://checkout.square.site/merchant/MLEN13J2Q870X/checkout/JPLWNZJHIZLV5W4IUELGOGVJ";

export const GOOGLE_MAPS_URL = "https://maps.app.goo.gl/XPFXGcdt8X4X2s526";

export const COMEDIAN_SIGNUP_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSez1iKO8qEslYXnPWztk0AEYQbyeDRMYnVCjhWSJJCd_Np0YQ/viewform";

export const CREATIVE_DIRECTOR_WEBSITE_URL = "https://skmng.co/";

export const TOUR_PRESS_URL =
  "https://prtimes.jp/main/html/rd/p/000002802.000011305.html";

export const VENUE_NAME = "Moxy Tokyo Kinshicho";

export const VENUE_STREET = "3-4-2 Kotobashi";

export const VENUE_NEIGHBORHOOD = "Kinshicho";

export const VENUE_CITY = "Sumida-ku";

export const VENUE_REGION = "Tokyo, Japan";

export const VENUE_ADDRESS = `${VENUE_NAME}, ${VENUE_STREET}, ${VENUE_CITY}`;

export const VENUE_COORDINATES = "35.696° N, 139.814° E";

/** Moxy Tokyo Kinshicho — used for map centering */
export const VENUE_LAT = 35.696;
export const VENUE_LNG = 139.814;

/** Closest metro to the venue (~4 min walk) — JR Sobu / Tokyo Metro Hanzomon */
export const NEAREST_METRO_STATION = {
  name: "Kinshicho Station",
  lat: 35.69703,
  lng: 139.81389,
} as const;

export const VENUE_MAP_ZOOM = 16.4;
export const VENUE_MAP_PITCH = 58;
/** Zoomed out: greater Tokyo fits in frame (venue stays centered) */
export const VENUE_MAP_MIN_ZOOM = 8.5;
/** Mapbox streets max detail */
export const VENUE_MAP_MAX_ZOOM = 22;
export const VENUE_MAP_BEARING = -24;

/** Map page intro — start wide, fly in to venue */
export const VENUE_MAP_INTRO_ZOOM = VENUE_MAP_MIN_ZOOM;
export const VENUE_MAP_INTRO_PITCH = 0;
export const VENUE_MAP_INTRO_BEARING = 0;
export const VENUE_MAP_FLY_DURATION_MS = 3400;

export const MAPBOX_ACCESS_TOKEN =
  process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

/** Hosted Studio style (same as MAP/ export). Override via env if needed. */
export const MAPBOX_STYLE_URL =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL ??
  `mapbox://styles/sakaimng/${WSSC_MAP_STYLE_ID}`;

/** Local copy synced to public/map — used as fallback in the client */
export const MAPBOX_STYLE_LOCAL_PATH = WSSC_MAP_STYLE_PATH;
