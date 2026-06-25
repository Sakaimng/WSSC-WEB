import { Resend } from "resend";
import {
  TICKETS_FROM_EMAIL,
  TICKETS_FROM_NAME,
  getSiteUrl,
} from "@/lib/tickets/config";
import type { BookableEvent, TicketBooking } from "@/lib/tickets/types";

let resendClient: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;

  if (!resendClient) {
    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

function buildTicketEmailHtml(booking: TicketBooking, event: BookableEvent) {
  const siteUrl = getSiteUrl();

  return `
    <div style="font-family: Arial, sans-serif; color: #111; line-height: 1.6; max-width: 560px;">
      <h1 style="font-size: 20px; margin-bottom: 8px;">Your WSSC ticket</h1>
      <p>Thanks for booking with Why So Serious Comedy.</p>
      <p style="font-size: 28px; letter-spacing: 0.08em; font-weight: 700; margin: 24px 0;">
        ${booking.code}
      </p>
      <p><strong>${event.title}</strong><br />
      ${event.dateLabel} · ${event.time}<br />
      Moxy Tokyo Kinshicho</p>
      <p>Quantity: ${booking.quantity}<br />
      Email: ${booking.customerEmail}</p>
      <p>Show this code at the door. If you have questions, reply to this email.</p>
      <p style="margin-top: 24px;">
        <a href="${siteUrl}/tickets" style="color: #111;">${siteUrl}/tickets</a>
      </p>
    </div>
  `;
}

export async function sendTicketConfirmationEmail(
  booking: TicketBooking,
  event: BookableEvent,
) {
  const resend = getResend();
  if (!resend) {
    console.warn("[tickets] RESEND_API_KEY is not set; skipping confirmation email.");
    return { sent: false as const };
  }

  const subject = `Your WSSC ticket — ${booking.code}`;
  const html = buildTicketEmailHtml(booking, event);

  const { error } = await resend.emails.send({
    from: `${TICKETS_FROM_NAME} <${TICKETS_FROM_EMAIL}>`,
    to: booking.customerEmail,
    subject,
    html,
  });

  if (error) {
    console.error("[tickets] Failed to send confirmation email:", error);
    return { sent: false as const, error };
  }

  return { sent: true as const };
}
