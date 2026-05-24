export type TokyoDate = {
  year: number;
  month: number;
  day: number;
};

export type UpcomingShow = {
  key: string;
  label: string;
  date: string;
  year: number;
  month: number;
  day: number;
};

export const SHOW_TIME = "9:00 PM";

/** Asia/Tokyo wall time; matches {@link SHOW_TIME} (9:00 PM). */
export const SHOW_START_HOUR_TOKYO = 21;
export const SHOW_START_MINUTE_TOKYO = 0;

/** Each performance is one hour (Tokyo local). */
export const SHOW_DURATION_MS = 60 * 60 * 1000;

function getTokyoDateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const num = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value ?? 0);

  return {
    year: num("year"),
    month: num("month") - 1,
    day: num("day"),
    hour: num("hour"),
    minute: num("minute"),
    second: num("second"),
  };
}

/**
 * `true` when it is a scheduled show day in Tokyo and local time is within the
 * one-hour window starting at {@link SHOW_START_HOUR_TOKYO}:{@link SHOW_START_MINUTE_TOKYO}.
 */
export function isShowLive(now = new Date()): boolean {
  const { year, month, day, hour, minute, second } = getTokyoDateTimeParts(now);
  if (!getEventLabel(year, month, day)) return false;

  const startMs =
    (SHOW_START_HOUR_TOKYO * 3600 + SHOW_START_MINUTE_TOKYO * 60) * 1000;
  const endMs = startMs + SHOW_DURATION_MS;
  const tickMs = ((hour * 60 + minute) * 60 + second) * 1000;
  return tickMs >= startMs && tickMs < endMs;
}

/** HH:mm:ss.mmm in Asia/Tokyo for display. */
export function formatTokyoTimeWithMilliseconds(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Tokyo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    fractionalSecondDigits: 3,
    hour12: false,
  }).formatToParts(date);

  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((p) => p.type === type)?.value ?? "";

  const frac = get("fractionalSecond") || "000";

  return `${get("hour")}:${get("minute")}:${get("second")}.${frac}`;
}

export function getTokyoToday(): TokyoDate {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date());

  return {
    year: Number(parts.find((part) => part.type === "year")?.value),
    month: Number(parts.find((part) => part.type === "month")?.value) - 1,
    day: Number(parts.find((part) => part.type === "day")?.value),
  };
}

function weekdayInCalendarWeek(
  year: number,
  month: number,
  weekIndex: number,
  weekday: number,
) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const day = 1 - firstWeekday + weekIndex * 7 + weekday;

  return day >= 1 && day <= daysInMonth ? day : null;
}

/** Monday = start of week … Sunday = end; weeks are Mon–Sun (ISO-style). */
function mondayStartOfWeekContaining(
  year: number,
  month: number,
  dayOfMonth: number,
): Date {
  const d = new Date(year, month, dayOfMonth);
  const dow = d.getDay();
  const delta = dow === 0 ? -6 : 1 - dow;
  const mon = new Date(d);
  mon.setDate(d.getDate() + delta);
  mon.setHours(12, 0, 0, 0);
  return mon;
}

/**
 * Wednesday of the Mon–Sun week immediately **after** the week that contains
 * `anchorDay` (still in this month when possible).
 */
function wednesdayOfMondayWeekAfterMondayWeekContaining(
  year: number,
  month: number,
  anchorDay: number,
): number | null {
  const anchor = new Date(year, month, anchorDay);
  if (anchor.getFullYear() !== year || anchor.getMonth() !== month) return null;

  const mon = mondayStartOfWeekContaining(year, month, anchorDay);
  const nextMonday = new Date(mon);
  nextMonday.setDate(mon.getDate() + 7);
  const wednesday = new Date(nextMonday);
  wednesday.setDate(nextMonday.getDate() + 2);

  if (wednesday.getFullYear() !== year || wednesday.getMonth() !== month) {
    return null;
  }
  return wednesday.getDate();
}

function firstFridayStrictlyAfterDay(
  year: number,
  month: number,
  afterDay: number,
): number | null {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = afterDay + 1; d <= daysInMonth; d += 1) {
    if (new Date(year, month, d).getDay() === 5) return d;
  }
  return null;
}

/** Last calendar day (1-based) of the Mon–Sun week that contains `dayOfMonth`. */
function sundayEndOfMondayWeekContaining(
  year: number,
  month: number,
  dayOfMonth: number,
): number {
  const mon = mondayStartOfWeekContaining(year, month, dayOfMonth);
  const sun = new Date(mon);
  sun.setDate(mon.getDate() + 6);
  if (sun.getFullYear() !== year || sun.getMonth() !== month) {
    return new Date(year, month + 1, 0).getDate();
  }
  return sun.getDate();
}

function sameMondayWeek(
  year: number,
  month: number,
  dayA: number,
  dayB: number,
): boolean {
  return (
    mondayStartOfWeekContaining(year, month, dayA).getTime() ===
    mondayStartOfWeekContaining(year, month, dayB).getTime()
  );
}

/**
 * Four shows / month, **at most one per Mon–Sun week** (weeks start on Monday).
 *
 * **Normal:** row 0 Wed, row 1 Fri, row 2 Wed, row 3 Fri (Sunday-first calendar **rows**).
 * If row 3 Fri shares a Mon–Sun week with row 2 Wed, Week 4 Fri moves to the first Friday
 * after that Wednesday's week ends.
 *
 * **First row has no Wednesday:** Week 1 Wed is the Wednesday in the Mon–Sun week **after**
 * the week that contains row 1 Friday (“second Friday show” week). Week 2 Fri stays row 1
 * Friday (e.g. May 2026: Fri 8 before Wed 13). Week 3 Wed is row 2 Wednesday unless it is
 * the same day as Week 1 Wed, then row 4 Wednesday. Week 4 Fri is row 3 Friday, pushed if it
 * shares a week with Week 3 Wed.
 */
function getScheduledShowDays(year: number, month: number) {
  const row1Fri = weekdayInCalendarWeek(year, month, 1, 5);
  const firstRowWed = weekdayInCalendarWeek(year, month, 0, 3);
  const thirdRowWed = weekdayInCalendarWeek(year, month, 2, 3);
  const fourthRowWed = weekdayInCalendarWeek(year, month, 4, 3);
  const fifthRowWed = weekdayInCalendarWeek(year, month, 5, 3);
  const fourthRowFri = weekdayInCalendarWeek(year, month, 3, 5);

  if (row1Fri == null) {
    return {
      week1Wed: null,
      week2Fri: null,
      week3Wed: null,
      week4Fri: null,
    };
  }

  if (firstRowWed != null) {
    let week3Wed = thirdRowWed;
    let week4Fri = fourthRowFri;
    if (
      week3Wed != null &&
      week4Fri != null &&
      sameMondayWeek(year, month, week3Wed, week4Fri)
    ) {
      week4Fri = firstFridayStrictlyAfterDay(
        year,
        month,
        sundayEndOfMondayWeekContaining(year, month, week3Wed),
      );
    }
    return {
      week1Wed: firstRowWed,
      week2Fri: row1Fri,
      week3Wed: week3Wed,
      week4Fri: week4Fri,
    };
  }

  const week1Wed = wednesdayOfMondayWeekAfterMondayWeekContaining(
    year,
    month,
    row1Fri,
  );
  if (week1Wed == null) {
    return {
      week1Wed: null,
      week2Fri: row1Fri,
      week3Wed: null,
      week4Fri: null,
    };
  }

  const week2Fri = row1Fri;

  let week3Wed: number | null = thirdRowWed;
  if (week3Wed == null) {
    week3Wed = fourthRowWed;
  }
  if (week3Wed === week1Wed) {
    week3Wed = fourthRowWed ?? fifthRowWed;
  }

  let week4Fri = fourthRowFri;
  if (
    week3Wed != null &&
    week4Fri != null &&
    sameMondayWeek(year, month, week3Wed, week4Fri)
  ) {
    week4Fri = firstFridayStrictlyAfterDay(
      year,
      month,
      sundayEndOfMondayWeekContaining(year, month, week3Wed),
    );
  }

  return {
    week1Wed,
    week2Fri,
    week3Wed,
    week4Fri,
  };
}

export function getEventLabel(year: number, month: number, day: number) {
  const { week1Wed, week2Fri, week3Wed, week4Fri } = getScheduledShowDays(
    year,
    month,
  );

  if (day === week1Wed) return "Week 1 Wed";
  if (day === week2Fri) return "Week 2 Fri";
  if (day === week3Wed) return "Week 3 Wed";
  if (day === week4Fri) return "Week 4 Fri";
  return null;
}

export function addMonths(year: number, month: number, offset: number) {
  const date = new Date(year, month + offset, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

export function getUpcomingShows(
  today = getTokyoToday(),
  count = 1,
  locale = "en-US",
): UpcomingShow[] {
  const shows: UpcomingShow[] = [];

  for (let offset = 0; shows.length < count && offset < 8; offset += 1) {
    const { year, month } = addMonths(today.year, today.month, offset);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day += 1) {
      if (shows.length >= count) break;
      if (offset === 0 && day < today.day) continue;

      const label = getEventLabel(year, month, day);
      if (!label) continue;

      shows.push({
        key: `${year}-${month}-${day}`,
        label,
        date: new Intl.DateTimeFormat(locale, {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(new Date(year, month, day)),
        year,
        month,
        day,
      });
    }
  }

  return shows;
}
