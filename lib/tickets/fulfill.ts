import { getBookableEventById } from "@/lib/tickets/events";
import { sendTicketConfirmationEmail } from "@/lib/tickets/email";
import {
  createPaidBooking,
  getBookingBySessionId,
  markBookingEmailSent,
} from "@/lib/tickets/store";
import type Stripe from "stripe";

export async function fulfillPaidCheckoutSession(session: Stripe.Checkout.Session) {
  if (!session.id || session.payment_status !== "paid") return null;

  const metadata = session.metadata ?? {};
  const eventId = metadata.eventId;
  const customerEmail =
    session.customer_details?.email ?? metadata.customerEmail ?? session.customer_email;
  const quantity = Number(metadata.quantity ?? 1);

  if (!eventId || !customerEmail) return null;

  let booking = await getBookingBySessionId(session.id);
  if (!booking) {
    const event = await getBookableEventById(eventId);
    const eventTitle = event?.title ?? metadata.eventTitle ?? "WSSC Show";
    const eventDateIso = event?.dateIso ?? metadata.eventDateIso ?? "";
    const eventTime = event?.time ?? metadata.eventTime ?? "";

    if (!event && !metadata.eventTitle) return null;

    booking = await createPaidBooking({
      eventId,
      eventTitle,
      eventDateIso,
      eventTime,
      customerEmail,
      customerName: metadata.customerName || undefined,
      quantity: Number.isFinite(quantity) && quantity > 0 ? quantity : 1,
      amountJpy: session.amount_total ?? (event?.priceJpy ?? 0) * quantity,
      stripeSessionId: session.id,
      stripePaymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id,
    });
  }

  if (!booking.emailSentAt) {
    const event = await getBookableEventById(booking.eventId);
    if (event) {
      const emailResult = await sendTicketConfirmationEmail(booking, event);
      if (emailResult.sent) {
        await markBookingEmailSent(session.id);
      }
    }
  }

  return booking;
}
