import type { Metadata } from "next";
import { comedians } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Roster",
  description: "Regular comedians at Why So Serious Comedy.",
};

export default function RosterPage() {
  return (
    <div className="box-border w-full max-w-none flex-1 px-[2vw] py-12 sm:py-16">
      <header className="mb-12">
        <h1 className="font-sans text-4xl font-semibold tracking-wide text-white sm:text-5xl">
          Comedian roster
        </h1>
        <p className="mt-4 text-neutral-400">
          Faces you’ll see on our lineup. Edit names, roles, and bios in{" "}
          <code className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-sm text-white">
            lib/roster.ts
          </code>
          —and add headshots when you have them.
        </p>
      </header>

      <ul className="grid gap-6 sm:grid-cols-2">
        {comedians.map((c) => (
          <li
            key={c.id}
            className="flex gap-5 rounded-2xl border border-white/10 bg-neutral-950/50 p-6"
          >
            <div
              className="h-24 w-24 shrink-0 rounded-xl bg-neutral-800 ring-1 ring-white/10"
              aria-hidden
            />
            <div className="min-w-0">
              <h2 className="text-lg font-semibold text-white">{c.name}</h2>
              <p className="mt-0.5 text-xs font-semibold uppercase tracking-wider text-neutral-400">
                {c.role}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-400">{c.bio}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
