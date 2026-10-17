"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { products } from "@/data/products";
import { actions } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ArrowRightIcon, PlusIcon, SearchIcon, StarIcon } from "@/components/Icons";
import { btnGhost, btnPrimary } from "@/components/ui";

const featured = products.filter((p) => p.popular);
const orbit = ["🍜", "🥟", "🍛", "🐟", "🍤", "🍮"];

export default function Hero() {
  const { t, num, price, pick } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  // rotate the spotlight dish
  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % featured.length), 3500);
    return () => clearInterval(id);
  }, []);

  const dish = featured[index];

  function onSearch(e) {
    e.preventDefault();
    router.push(`/menu${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`);
  }

  return (
    <section className="relative -mt-16 overflow-hidden pt-16 lg:-mt-20 lg:pt-20">
      {/* soft background blobs */}
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-leaf-50 via-white to-aqua-50" />
      <div className="absolute -left-32 top-10 -z-10 size-[28rem] rounded-full bg-leaf-200/50 blur-3xl" />
      <div className="absolute -right-24 top-40 -z-10 size-[30rem] rounded-full bg-aqua-200/60 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-20 pt-10 sm:px-6 lg:grid-cols-2 lg:pt-16">
        <div className="animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full border border-leaf-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-leaf-700 shadow-sm">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-leaf-400 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-leaf-500" />
            </span>
            {t("heroBadge")}
          </span>

          <h1 className="mt-6 text-4xl font-extrabold leading-[1.15] tracking-tight text-ink sm:text-5xl lg:text-6xl">
            {t("heroTitle1")} <span className="text-gradient">{t("heroTitleHi")}</span>
            <br />
            {t("heroTitle2")}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-ink/65">{t("heroText")}</p>

          <form
            onSubmit={onSearch}
            className="mt-8 flex max-w-lg items-center gap-2 rounded-full border border-white bg-white/90 p-2 shadow-xl shadow-aqua-100 focus-within:ring-4 focus-within:ring-aqua-100"
          >
            <SearchIcon className="ml-3 size-5 shrink-0 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-ink/35"
              aria-label={t("search")}
            />
            <button className="rounded-full bg-linear-to-r from-leaf-400 to-aqua-400 px-5 py-2.5 font-semibold text-white transition hover:brightness-105 active:scale-95">
              {t("search")}
            </button>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/menu" className={btnPrimary}>
              {t("orderNow")} <ArrowRightIcon className="size-4" />
            </Link>
            <a href="#cuisines" className={btnGhost}>
              {t("exploreMenu")}
            </a>
          </div>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4">
            {[
              [num(products.length) + "+", t("statDishes")],
              [num("12k") + "+", t("statCustomers")],
              [num(30), t("statMinutes")],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/70 p-3 text-center shadow-sm">
                <dt className="text-2xl font-extrabold text-gradient">{value}</dt>
                <dd className="text-xs text-ink/55">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Spotlight dish */}
        <div className="relative mx-auto aspect-square w-full max-w-[520px]">
          <div className="absolute inset-6 animate-spin-slow rounded-full border-2 border-dashed border-leaf-300/70" />
          <div className="absolute inset-16 rounded-full bg-linear-to-br from-leaf-200 via-white to-aqua-200 shadow-[inset_0_0_60px_rgba(255,255,255,0.9)]" />

          {orbit.map((e, i) => {
            const angle = (i / orbit.length) * Math.PI * 2;
            return (
              <span
                key={e}
                className="absolute grid size-14 place-items-center rounded-2xl bg-white text-3xl shadow-lg animate-float sm:size-16"
                style={{
                  left: `calc(50% + ${Math.cos(angle) * 44}% - 2rem)`,
                  top: `calc(50% + ${Math.sin(angle) * 44}% - 2rem)`,
                  animationDelay: `${i * 0.6}s`,
                }}
              >
                {e}
              </span>
            );
          })}

          <div className="absolute inset-0 grid place-items-center">
            <div key={dish.id} className="flex animate-pop flex-col items-center">
              <span className="text-[8rem] leading-none drop-shadow-[0_25px_25px_rgba(18,50,74,0.25)] sm:text-[10rem]">
                {dish.emoji}
              </span>
            </div>
          </div>

          <div
            key={`card-${dish.id}`}
            className="glass absolute bottom-2 left-1/2 flex w-[88%] max-w-sm -translate-x-1/2 animate-fade-up items-center gap-3 rounded-3xl p-3 shadow-xl sm:bottom-6"
          >
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-linear-to-br from-leaf-100 to-aqua-100 text-2xl">
              {dish.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-leaf-600">🔥 {t("hotNow")}</p>
              <p className="truncate font-bold">{pick(dish.name)}</p>
              <p className="flex items-center gap-1 text-xs text-ink/55">
                <StarIcon className="size-3 text-amber-400" /> {num(dish.rating)} · {price(dish.price)}
              </p>
            </div>
            <button
              onClick={() => actions.addToCart(dish.id)}
              className="grid size-11 shrink-0 place-items-center rounded-full bg-linear-to-br from-leaf-400 to-aqua-400 text-white shadow-lg transition hover:scale-110 active:scale-90"
              aria-label={t("addToCart")}
            >
              <PlusIcon />
            </button>
          </div>

          {/* dots */}
          <div className="absolute -bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 sm:-bottom-2">
            {featured.map((p, i) => (
              <button
                key={p.id}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${i === index ? "w-6 bg-leaf-500" : "w-1.5 bg-ink/15"}`}
                aria-label={pick(p.name)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
