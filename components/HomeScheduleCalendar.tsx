"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { EXTERNAL_TICKETS_URL } from "@/lib/config";

type TokyoDate = {
  year: number;
  month: number;
  day: number;
};

const SHOW_TIME = "9:00 PM";

function getTokyoToday(): TokyoDate {
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

function getEventLabel(year: number, month: number, day: number) {
  const firstWeekWednesday = weekdayInCalendarWeek(year, month, 0, 3);
  const secondWeekFriday = weekdayInCalendarWeek(year, month, 1, 5);
  const thirdWeekWednesday = weekdayInCalendarWeek(year, month, 2, 3);
  const fourthWeekFriday = weekdayInCalendarWeek(year, month, 3, 5);

  if (day === firstWeekWednesday) return "Week 1 Wed";
  if (day === secondWeekFriday) return "Week 2 Fri";
  if (day === thirdWeekWednesday) return "Week 3 Wed";
  if (day === fourthWeekFriday) return "Week 4 Fri";
  return null;
}

function addMonths(year: number, month: number, offset: number) {
  const date = new Date(year, month + offset, 1);
  return {
    year: date.getFullYear(),
    month: date.getMonth(),
  };
}

function getUpcomingShows(today: TokyoDate, count = 6) {
  const shows: { key: string; label: string; date: string }[] = [];

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
        date: new Intl.DateTimeFormat("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        }).format(new Date(year, month, day)),
      });
    }
  }

  return shows;
}

export function HomeScheduleCalendar() {
  const root = useRef<HTMLElement>(null);
  const [today, setToday] = useState<TokyoDate | null>(null);

  useEffect(() => {
    setToday(getTokyoToday());
  }, []);

  const upcomingShows = useMemo(() => (today ? getUpcomingShows(today) : []), [today]);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || !today) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".schedule-reveal");

      gsap.set(items, { autoAlpha: 0, y: 28 });
      gsap.to(items, {
        autoAlpha: 1,
        y: 0,
        duration: 0.72,
        stagger: 0.08,
        ease: "power3.out",
      });
    }, el);

    return () => ctx.revert();
  }, [today]);

  return (
    <section
      ref={root}
      className="border-t border-white/10 bg-black px-[2vw] py-20 sm:py-24"
    >
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
        <div className="max-w-xl">
          <p className="schedule-reveal text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Schedule
          </p>
          <h2 className="schedule-reveal mt-4 max-w-xl font-sans text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Upcoming dates.
          </h2>
          <p className="schedule-reveal mt-6 max-w-md leading-relaxed text-neutral-400">
            Join us once a week: Wednesday on the 1st and 3rd calendar weeks, Friday on the 2nd
            and 4th calendar weeks. Shows start at <span className="text-white">{SHOW_TIME}</span>.
          </p>
          <a
            href={EXTERNAL_TICKETS_URL}
            target="_blank"
            rel="noreferrer"
            className="schedule-reveal mt-6 inline-flex rounded-full border border-white bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            See all Meetup dates
          </a>
        </div>

        <div className="schedule-reveal rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-neutral-500">
            Upcoming dates
          </p>
          <div className="mt-5 divide-y divide-white/10">
            {upcomingShows.map((show) => (
              <div
                key={show.key}
                className="grid gap-2 py-4 first:pt-0 last:pb-0 sm:grid-cols-[1fr_auto] sm:items-center"
              >
                <span className="font-sans text-2xl font-semibold tracking-wide text-white">
                  {show.date}
                </span>
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                  {show.label} / {SHOW_TIME}
                </span>
              </div>
            ))}
          </div>
          {upcomingShows.length === 0 ? (
            <p className="mt-5 text-sm text-neutral-500">
              Dates will appear here once the next schedule window opens.
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
