import Stripe from "stripe";
import { getSiteUrl } from "@/lib/tickets/config";

let stripeClient: Stripe | null = null;

export function getStripe() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }

  return stripeClient;
}

export async function createTicketCheckoutSession(input: {
  eventId: string;
  eventTitle: string;
  eventDateLabel: string;
  eventDateIso: string;
  eventTime: string;
  priceJpy: number;
  quantity: number;
  customerEmail: string;
  customerName?: string;
  bookingId: string;
}) {
  const stripe = getStripe();
  const siteUrl = getSiteUrl();
  const productName = `${input.eventTitle} — ${input.eventDateLabel}`;

  return stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: input.customerEmail,
    line_items: [
      {
        price_data: {
          currency: "jpy",
          unit_amount: input.priceJpy,
          product_data: {
            name: productName,
            description: `${input.eventTime} · Moxy Tokyo Kinshicho`,
          },
        },
        quantity: input.quantity,
      },
    ],
    metadata: {
      bookingId: input.bookingId,
      eventId: input.eventId,
      eventTitle: input.eventTitle,
      eventDateIso: input.eventDateIso,
      eventTime: input.eventTime,
      customerEmail: input.customerEmail,
      customerName: input.customerName ?? "",
      quantity: String(input.quantity),
    },
    success_url: `${siteUrl}/tickets/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/tickets?cancelled=1`,
  });
}
