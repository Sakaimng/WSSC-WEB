export const DEFAULT_SHOW_PRICE_JPY = Number(
  process.env.TICKET_SHOW_PRICE_JPY ?? "1000",
);

export const DEFAULT_SHOW_CAPACITY = Number(
  process.env.TICKET_SHOW_CAPACITY ?? "60",
);

export const MAX_TICKETS_PER_ORDER = Number(
  process.env.TICKET_MAX_PER_ORDER ?? "6",
);

export const TICKETS_FROM_EMAIL =
  process.env.TICKETS_FROM_EMAIL ?? "tickets@wsscomedy.com";

export const TICKETS_FROM_NAME =
  process.env.TICKETS_FROM_NAME ?? "Why So Serious Comedy";

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return "http://localhost:3000";
}

export function isStripeConfigured() {
  return Boolean(
    process.env.STRIPE_SECRET_KEY &&
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  );
}

export function isEmailConfigured() {
  return Boolean(process.env.RESEND_API_KEY);
}
