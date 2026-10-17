"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { EmptyState, btnPrimary } from "@/components/ui";

// Demo timeline (seconds after placing the order)
const STAGES = [
  { at: 0, emoji: "✅" },
  { at: 8, emoji: "👨‍🍳" },
  { at: 20, emoji: "🛵" },
  { at: 40, emoji: "🏠" },
];
const TOTAL = STAGES[STAGES.length - 1].at;

function Confetti() {
  const pieces = ["🎉", "🥟", "🍛", "✨", "🍜", "🎊", "🐟", "🍮"];
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center gap-6 overflow-hidden">
      {pieces.map((p, i) => (
        <span key={i} className="animate-fade-up text-3xl" style={{ animationDelay: `${i * 90}ms` }}>
          {p}
        </span>
      ))}
    </div>
  );
}

export default function TrackView({ orderId, justPlaced }) {
  const { orders } = useStore();
  const { t, num, price, pick } = useI18n();
  const [now, setNow] = useState(null);

  useEffect(() => {
    const tick = () => setNow(Date.now());
    const first = setTimeout(tick, 0);
    const id = setInterval(tick, 1000);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, []);

  const order = orders.find((o) => o.id === orderId) ?? (orderId ? null : orders[0]);

  if (!order) {
    return (
      <div className="px-4">
        <EmptyState emoji="🛵" title={t("noOrders")} text={t("noOrdersText")}>
          <Link href="/menu" className={btnPrimary}>
            {t("browseMenu")} <ArrowRightIcon className="size-4" />
          </Link>
        </EmptyState>
      </div>
    );
  }

  const elapsed = now ? Math.max(0, (now - order.placedAt) / 1000) : 0;
  const stage = STAGES.reduce((s, st, i) => (elapsed >= st.at ? i : s), 0);
  const progress = Math.min(100, (elapsed / TOTAL) * 100);
  const minutesLeft = Math.max(0, Math.ceil(30 * (1 - progress / 100)));

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      {justPlaced && (
        <div className="relative mb-8 overflow-hidden rounded-4xl bg-linear-to-r from-leaf-200 to-aqua-200 px-6 pb-8 pt-14 text-center">
          <Confetti />
          <h1 className="animate-pop text-3xl font-extrabold sm:text-4xl">{t("orderPlaced")}</h1>
          <p className="mt-2 text-ink/70">
            {t("orderId")}: <b className="font-mono">{order.id}</b>
          </p>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-extrabold">{t("trackTitle")}</h2>
              <p className="mt-1 text-sm text-ink/50">
                {t("orderId")}: <span className="font-mono font-semibold text-ink/70">{order.id}</span>
              </p>
            </div>
            <div className="rounded-2xl bg-linear-to-br from-leaf-50 to-aqua-50 px-4 py-3 text-right">
              <p className="text-xs text-ink/50">{t("eta")}</p>
              <p className="text-2xl font-extrabold text-gradient">
                {stage === 3 ? "✓" : `${num(minutesLeft)} ${t("mins")}`}
              </p>
            </div>
          </div>

          {/* Progress road */}
          <div className="relative mt-8 h-3 rounded-full bg-leaf-50">
            <div
              className="h-full rounded-full bg-linear-to-r from-leaf-400 to-aqua-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progress}%` }}
            />
            <span
              className="absolute -top-6 text-3xl transition-all duration-1000 ease-linear"
              style={{ left: `calc(${progress}% - 1.2rem)` }}
            >
              🛵
            </span>
          </div>

          <ol className="mt-10 space-y-1">
            {STAGES.map((s, i) => {
              const done = i < stage || stage === 3;
              const current = i === stage && stage !== 3;
              return (
                <li key={i} className="relative flex gap-4 pb-6 last:pb-0">
                  {i < STAGES.length - 1 && (
                    <span className={`absolute left-6 top-12 h-[calc(100%-3rem)] w-0.5 ${i < stage ? "bg-leaf-300" : "bg-ink/10"}`} />
                  )}
                  <span
                    className={`relative grid size-12 shrink-0 place-items-center rounded-2xl text-2xl transition-all duration-500 ${
                      done
                        ? "bg-leaf-100"
                        : current
                          ? "bg-aqua-100 ring-4 ring-aqua-200"
                          : "bg-ink/5 grayscale opacity-50"
                    }`}
                  >
                    {s.emoji}
                    {current && <span className="absolute inset-0 animate-ping rounded-2xl bg-aqua-300/30" />}
                    {done && (
                      <span className="absolute -bottom-1 -right-1 grid size-5 place-items-center rounded-full bg-leaf-500 text-white">
                        <CheckIcon className="size-3" />
                      </span>
                    )}
                  </span>
                  <div className="pt-1">
                    <p className={`font-bold ${done || current ? "text-ink" : "text-ink/40"}`}>{t(`stage${i}`)}</p>
                    <p className={`text-sm ${done || current ? "text-ink/60" : "text-ink/30"}`}>{t(`stage${i}d`)}</p>
                  </div>
                </li>
              );
            })}
          </ol>
          <p className="mt-6 text-xs text-ink/40">⏱ {t("demoSpeed")}</p>
        </section>

        <aside className="space-y-4">
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)]">
            <h3 className="mb-4 font-bold">{t("orderSummary")}</h3>
            <ul className="space-y-3">
              {order.items.map((item) => {
                const p = getProduct(item.id);
                if (!p) return null;
                return (
                  <li key={item.key} className="flex items-center gap-3 text-sm">
                    <span className="grid size-10 place-items-center rounded-xl bg-linear-to-br from-leaf-100 to-aqua-100 text-xl">{p.emoji}</span>
                    <span className="flex-1 truncate font-medium">{pick(p.name)}</span>
                    <span className="text-ink/55">×{num(item.qty)}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 flex justify-between border-t border-dashed border-leaf-200 pt-4 font-extrabold">
              <span>{t("total")}</span>
              <span className="text-gradient">{price(order.totals.total)}</span>
            </div>
            <p className="mt-3 text-xs text-ink/50">
              {t(order.payment)} · {order.area}
            </p>
          </div>

          {orders.length > 1 && (
            <div className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)]">
              <h3 className="mb-3 font-bold">{t("recentOrders")}</h3>
              <ul className="space-y-2">
                {orders.slice(0, 5).map((o) => (
                  <li key={o.id}>
                    <Link
                      href={`/track?id=${o.id}`}
                      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition hover:bg-leaf-50 ${
                        o.id === order.id ? "bg-leaf-50 font-semibold" : ""
                      }`}
                    >
                      <span className="font-mono">{o.id}</span>
                      <span className="text-ink/55">{price(o.totals.total)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
