"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { TagIcon, CheckIcon } from "@/components/Icons";
import { Reveal } from "@/components/ui";

// Deal resets at midnight every day.
function timeLeft() {
  const now = new Date();
  const end = new Date(now);
  end.setHours(24, 0, 0, 0);
  const s = Math.max(0, Math.floor((end - now) / 1000));
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60];
}

export default function OfferBanner() {
  const { t, num } = useI18n();
  const [left, setLeft] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const tick = () => setLeft(timeLeft());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText("KHANA10");
    } catch {
      // clipboard blocked – still show feedback
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const units = [t("hrs"), t("minsShort"), t("secs")];

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-linear-to-r from-leaf-300 via-leaf-200 to-aqua-300 p-8 shadow-2xl shadow-leaf-200/60 sm:p-12">
          <div className="absolute -right-10 -top-16 size-72 rounded-full bg-white/25" />
          <div className="absolute -bottom-24 left-1/3 size-72 rounded-full bg-white/20" />
          <span className="absolute right-8 top-8 hidden text-8xl animate-float-slow lg:block">🥡</span>
          <span className="absolute bottom-6 right-40 hidden text-7xl animate-float lg:block">🍛</span>

          <div className="relative max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-1.5 text-sm font-semibold text-leaf-700">
              <TagIcon className="size-4" /> {t("offerTag")}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-ink sm:text-5xl">{t("offerTitle")}</h2>
            <p className="mt-3 text-lg text-ink/70">{t("offerText")}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={copy}
                className="group flex items-center gap-3 rounded-2xl border-2 border-dashed border-white bg-white/50 px-5 py-3 font-mono text-xl font-bold tracking-widest text-ink backdrop-blur transition hover:bg-white/80"
              >
                KHANA10
                <span className="rounded-full bg-ink px-3 py-1 font-sans text-xs font-semibold tracking-normal text-white">
                  {copied ? (
                    <span className="flex items-center gap-1">
                      <CheckIcon className="size-3" /> {t("copied")}
                    </span>
                  ) : (
                    t("copyCode")
                  )}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink/70">{t("endsIn")}</span>
                {units.map((u, i) => (
                  <div key={u} className="min-w-16 rounded-2xl bg-white/80 px-3 py-2 text-center shadow-sm">
                    <div className="text-2xl font-extrabold tabular-nums text-ink">
                      {left ? num(String(left[i]).padStart(2, "0")) : "--"}
                    </div>
                    <div className="text-[10px] font-medium uppercase text-ink/50">{u}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
