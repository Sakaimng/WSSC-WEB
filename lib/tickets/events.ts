import {
  DEFAULT_SHOW_CAPACITY,
  DEFAULT_SHOW_PRICE_JPY,
} from "@/lib/tickets/config";
import { specialTicketEvents } from "@/lib/tickets/special-events";
import { getPaidQuantityForEvent } from "@/lib/tickets/store";
import type { BookableEvent } from "@/lib/tickets/types";
import {
  getTokyoToday,
  getUpcomingShows,
  SHOW_TIME,
} from "@/lib/show-schedule";
import type { Language } from "@/lib/i18n";

function showEventId(year: number, month: number, day: number) {
  return `show-${year}-${month + 1}-${day}`;
}

function parseShowEventId(eventId: string) {
  const match = /^show-(\d+)-(\d+)-(\d+)$/.exec(eventId);
  if (!match) return null;

  return {
    year: Number(match[1]),
    month: Number(match[2]) - 1,
    day: Number(match[3]),
  };
}

export async function getBookableEvents(
  language: Language = "en",
  showCount = 8,
): Promise<BookableEvent[]> {
  const locale = language === "jp" ? "ja-JP" : "en-US";
  const today = getTokyoToday();
  const shows = getUpcomingShows(today, showCount, locale);
  const showEvents: BookableEvent[] = [];

  for (const show of shows) {
    const id = showEventId(show.year, show.month, show.day);
    const sold = await getPaidQuantityForEvent(id);
    const capacity = DEFAULT_SHOW_CAPACITY;
    const remaining = Math.max(capacity - sold, 0);

    showEvents.push({
      id,
      kind: "show",
      title: "Why So Serious Comedy",
      titleJp: "Why So Serious Comedy",
      description: "English stand-up at Moxy Tokyo Kinshicho.",
      descriptionJp: "モクシー東京錦糸町での英語スタンドアップコメディ。",
      dateIso: `${show.year}-${String(show.month + 1).padStart(2, "0")}-${String(show.day).padStart(2, "0")}`,
      dateLabel: show.date,
      time: SHOW_TIME,
      priceJpy: DEFAULT_SHOW_PRICE_JPY,
      capacity,
      sold,
      remaining,
      available: remaining > 0,
    });
  }

  const specialEvents: BookableEvent[] = [];

  for (const event of specialTicketEvents.filter((item) => item.active)) {
    const sold = await getPaidQuantityForEvent(event.id);
    const remaining = Math.max(event.capacity - sold, 0);
    const date = new Date(`${event.date}T12:00:00`);

    specialEvents.push({
      id: event.id,
      kind: "special",
      title: event.title,
      titleJp: event.titleJp,
      description: event.description,
      descriptionJp: event.descriptionJp,
      dateIso: event.date,
      dateLabel: new Intl.DateTimeFormat(locale, {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(date),
      time: event.time,
      priceJpy: event.priceJpy,
      capacity: event.capacity,
      sold,
      remaining,
      available: remaining > 0,
    });
  }

  return [...specialEvents, ...showEvents].sort((left, right) =>
    left.dateIso.localeCompare(right.dateIso),
  );
}

export async function getBookableEventById(eventId: string, language: Language = "en") {
  const events = await getBookableEvents(language, 24);
  return events.find((event) => event.id === eventId) ?? null;
}

export { parseShowEventId };
