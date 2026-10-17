"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct, largePrice, products } from "@/data/products";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { ArrowLeftIcon, CartIcon, ClockIcon, HeartIcon } from "@/components/Icons";
import { FoodVisual, QtyStepper, SpiceMeter, Stars, btnGhost, btnPrimary } from "@/components/ui";

const sampleReviews = [
  {
    name: { en: "Rafi", bn: "রাফি" },
    rating: 5,
    text: { en: "Generous portion and perfectly seasoned.", bn: "পরিমাণে যথেষ্ট আর মশলা একদম ঠিকঠাক।" },
  },
  {
    name: { en: "Mim", bn: "মিম" },
    rating: 4,
    text: { en: "Arrived hot, packaging was neat. Will order again!", bn: "গরম এসেছে, প্যাকেজিং সুন্দর। আবার অর্ডার করব!" },
  },
  {
    name: { en: "Sadia", bn: "সাদিয়া" },
    rating: 5,
    text: { en: "Tastes homemade. My new favourite.", bn: "ঘরের রান্নার মতো স্বাদ। এখন আমার প্রিয়।" },
  },
];

export default function ProductDetail({ id }) {
  const product = getProduct(id);
  const router = useRouter();
  const { wishlist } = useStore();
  const { lang, t, num, price, pick } = useI18n();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("regular");
  const [tab, setTab] = useState("description");

  const wished = wishlist.includes(product.id);
  const unit = size === "large" ? largePrice(product.price) : product.price;

  const related = products
    .filter((p) => p.id !== product.id && (p.cuisine === product.cuisine || p.type === product.type))
    .sort((a, b) => (b.type === product.type) - (a.type === product.type) || b.rating - a.rating)
    .slice(0, 4);

  function buyNow() {
    actions.addToCart(product.id, qty, size, { silent: true });
    router.push("/checkout");
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link href="/menu" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink/60 hover:gap-3 hover:text-leaf-600">
        <ArrowLeftIcon className="size-4" /> {t("backToMenu")}
      </Link>

      <div className="grid gap-10 lg:grid-cols-2">
        {/* Visual */}
        <div className="group relative animate-pop">
          <FoodVisual product={product} className="aspect-square rounded-[2.5rem] shadow-2xl shadow-leaf-100" size="text-[11rem] sm:text-[14rem]" float />
          <button
            onClick={() => actions.toggleWishlist(product.id)}
            className={`absolute right-5 top-5 grid size-12 place-items-center rounded-full bg-white shadow-lg transition hover:scale-110 ${
              wished ? "text-rose-500" : "text-ink/40"
            }`}
            aria-label={t("wishlist")}
            aria-pressed={wished}
          >
            <HeartIcon filled={wished} className={`size-6 ${wished ? "animate-wiggle" : ""}`} />
          </button>
          <span
            className={`absolute left-5 top-5 rounded-full px-4 py-1.5 text-sm font-semibold text-white ${
              product.cuisine === "chinese" ? "bg-aqua-500" : "bg-leaf-500"
            }`}
          >
            {t(product.cuisine)} · {t(`type_${product.type}`)}
          </span>
        </div>

        {/* Info */}
        <div className="animate-fade-up">
          <div className="flex flex-wrap items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <Stars rating={product.rating} />
              <b>{num(product.rating)}</b>
              <span className="text-ink/50">
                ({num(product.reviews)} {t("reviews")})
              </span>
            </span>
            {product.veg && <span className="rounded-full bg-leaf-100 px-2.5 py-1 text-xs font-bold text-leaf-700">🌱 {t("veg")}</span>}
            {product.popular && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">🔥 {t("popular")}</span>}
          </div>

          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">{pick(product.name)}</h1>
          <p className="mt-1 text-lg text-ink/40">{product.name[lang === "en" ? "bn" : "en"]}</p>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-gradient">{price(unit * qty)}</span>
            {product.oldPrice && size === "regular" && (
              <span className="pb-1 text-lg text-ink/35 line-through">{price(product.oldPrice * qty)}</span>
            )}
          </div>

          <p className="mt-5 text-lg leading-relaxed text-ink/70">{pick(product.desc)}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-ink/50">{t("spiceLevel")}</p>
              <div className="mt-1">
                <SpiceMeter level={product.spice} showLabel />
              </div>
            </div>
            <div className="rounded-2xl bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-ink/50">{t("prepTime")}</p>
              <p className="mt-1 flex items-center gap-1.5 font-semibold">
                <ClockIcon className="size-4 text-aqua-500" /> {num(product.time)} {t("mins")}
              </p>
            </div>
          </div>

          {/* Portion */}
          <div className="mt-6">
            <p className="mb-2 text-sm font-semibold text-ink/60">{t("size")}</p>
            <div className="flex gap-3">
              {["regular", "large"].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`flex-1 rounded-2xl border-2 px-4 py-3 text-left transition sm:flex-none sm:min-w-40 ${
                    size === s ? "border-leaf-400 bg-leaf-50" : "border-transparent bg-white hover:border-leaf-200"
                  }`}
                >
                  <span className="block font-semibold">{t(s)}</span>
                  <span className="text-sm text-ink/55">
                    {price(s === "large" ? largePrice(product.price) : product.price)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <QtyStepper value={qty} onChange={setQty} />
            <button onClick={() => actions.addToCart(product.id, qty, size)} className={`${btnPrimary} flex-1 sm:flex-none`}>
              <CartIcon className="size-5" /> {t("addToCart")}
            </button>
            <button onClick={buyNow} className={`${btnGhost} flex-1 sm:flex-none`}>
              {t("buyNow")}
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-10">
            <div className="flex gap-1 rounded-full bg-white p-1 shadow-sm sm:w-fit" role="tablist">
              {["description", "ingredients", "customerReviews"].map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`flex-1 rounded-full px-4 py-2 text-sm font-semibold transition sm:flex-none ${
                    tab === k ? "bg-aqua-100 text-aqua-700" : "text-ink/55 hover:text-ink"
                  }`}
                >
                  {t(k)}
                </button>
              ))}
            </div>
            <div key={tab} className="mt-4 animate-fade-up rounded-3xl bg-white p-6 shadow-sm">
              {tab === "description" && <p className="leading-relaxed text-ink/70">{pick(product.desc)}</p>}
              {tab === "ingredients" && (
                <ul className="flex flex-wrap gap-2">
                  {pick(product.ingredients).map((ing) => (
                    <li key={ing} className="rounded-full bg-leaf-50 px-3.5 py-1.5 text-sm font-medium text-leaf-700 ring-1 ring-leaf-100">
                      {ing}
                    </li>
                  ))}
                </ul>
              )}
              {tab === "customerReviews" && (
                <ul className="space-y-4">
                  {sampleReviews.map((r) => (
                    <li key={r.name.en} className="flex gap-3">
                      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-leaf-200 to-aqua-200 font-bold text-ink">
                        {pick(r.name)[0]}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <b>{pick(r.name)}</b>
                          <Stars rating={r.rating} className="size-3.5" />
                        </div>
                        <p className="text-sm text-ink/65">{pick(r.text)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mt-20">
        <h2 className="mb-6 text-2xl font-extrabold sm:text-3xl">{t("youMayLike")}</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
