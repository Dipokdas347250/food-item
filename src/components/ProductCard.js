"use client";

import Link from "next/link";
import { useState } from "react";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { ClockIcon, HeartIcon, PlusIcon, StarIcon, CheckIcon } from "@/components/Icons";
import { FoodVisual, SpiceMeter } from "@/components/ui";

export default function ProductCard({ product }) {
  const { wishlist } = useStore();
  const { t, num, price, pick } = useI18n();
  const [justAdded, setJustAdded] = useState(false);
  const wished = wishlist.includes(product.id);

  function add() {
    actions.addToCart(product.id);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1200);
  }

  const discount = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-3xl border border-white bg-white shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-20px_rgba(34,176,112,0.45)]">
      <Link href={`/menu/${product.id}`} className="block">
        <FoodVisual product={product} className="h-48" />
      </Link>

      {/* badges */}
      <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-1.5">
        <span
          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold backdrop-blur ${
            product.cuisine === "chinese" ? "bg-aqua-500/85 text-white" : "bg-leaf-500/85 text-white"
          }`}
        >
          {t(product.cuisine)}
        </span>
        {product.isNew && (
          <span className="rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-aqua-700">
            ✨ {t("new")}
          </span>
        )}
        {discount > 0 && (
          <span className="rounded-full bg-rose-400/90 px-2.5 py-1 text-[11px] font-semibold text-white">
            -{num(discount)}% {t("off")}
          </span>
        )}
      </div>

      <button
        onClick={() => actions.toggleWishlist(product.id)}
        className={`absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/90 shadow transition hover:scale-110 ${
          wished ? "text-rose-500" : "text-ink/40 hover:text-rose-400"
        }`}
        aria-label={t("wishlist")}
        aria-pressed={wished}
      >
        <HeartIcon filled={wished} className={`size-[18px] ${wished ? "animate-wiggle" : ""}`} />
      </button>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-1.5 flex items-center justify-between text-xs text-ink/55">
          <span className="flex items-center gap-1">
            <StarIcon className="size-3.5 text-amber-400" />
            <b className="text-ink/80">{num(product.rating)}</b>
            <span>({num(product.reviews)})</span>
          </span>
          <span className="flex items-center gap-1">
            <ClockIcon className="size-3.5" /> {num(product.time)} {t("mins")}
          </span>
        </div>

        <Link href={`/menu/${product.id}`}>
          <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-leaf-600">
            {pick(product.name)}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-sm text-ink/55">{pick(product.desc)}</p>

        <div className="mt-2 flex items-center gap-2">
          <SpiceMeter level={product.spice} />
          {product.veg && (
            <span className="rounded-md bg-leaf-100 px-1.5 py-0.5 text-[10px] font-bold text-leaf-700">
              🌱 {t("veg")}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {product.oldPrice && (
              <span className="block text-xs text-ink/40 line-through">{price(product.oldPrice)}</span>
            )}
            <span className="text-xl font-extrabold text-ink">{price(product.price)}</span>
          </div>
          <button
            onClick={add}
            className={`flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-white shadow-md transition active:scale-90 ${
              justAdded
                ? "bg-leaf-500 shadow-leaf-200"
                : "bg-linear-to-r from-leaf-400 to-aqua-400 shadow-aqua-200 hover:brightness-105"
            }`}
          >
            {justAdded ? <CheckIcon className="size-4 animate-pop" /> : <PlusIcon className="size-4" />}
            {t("add")}
          </button>
        </div>
      </div>
    </article>
  );
}
