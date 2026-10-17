"use client";

import { useDeferredValue, useState } from "react";
import { cuisines, products, types } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/Icons";
import { EmptyState, btnPrimary } from "@/components/ui";

const MAX_PRICE = Math.max(...products.map((p) => p.price));

const sorters = {
  popular: (a, b) => b.reviews - a.reviews,
  rating: (a, b) => b.rating - a.rating,
  low: (a, b) => a.price - b.price,
  high: (a, b) => b.price - a.price,
};

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full px-4 py-2 text-sm font-medium transition active:scale-95 ${
        active
          ? "bg-linear-to-r from-leaf-400 to-aqua-400 text-white shadow-md shadow-leaf-200"
          : "bg-white text-ink/70 ring-1 ring-leaf-100 hover:ring-leaf-300"
      }`}
    >
      {children}
    </button>
  );
}

export default function MenuView({ initialCuisine, initialQuery }) {
  const { t, num, price } = useI18n();

  const [cuisine, setCuisine] = useState(cuisines.includes(initialCuisine) ? initialCuisine : "all");
  const [type, setType] = useState("all");
  const [query, setQuery] = useState(initialQuery);
  const [vegOnly, setVegOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE);
  const [maxSpice, setMaxSpice] = useState(3);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const q = useDeferredValue(query.trim().toLowerCase());

  const results = products
    .filter((p) => cuisine === "all" || p.cuisine === cuisine)
    .filter((p) => type === "all" || p.type === type)
    .filter((p) => !vegOnly || p.veg)
    .filter((p) => p.price <= maxPrice)
    .filter((p) => p.spice <= maxSpice)
    .filter(
      (p) =>
        !q ||
        [p.name.en, p.name.bn, p.desc.en, p.desc.bn, p.id].some((s) => s.toLowerCase().includes(q)),
    )
    .sort(sorters[sort]);

  const activeFilterCount =
    (type !== "all") + vegOnly + (maxPrice < MAX_PRICE) + (maxSpice < 3) + (cuisine !== "all");

  function reset() {
    setCuisine("all");
    setType("all");
    setQuery("");
    setVegOnly(false);
    setMaxPrice(MAX_PRICE);
    setMaxSpice(3);
  }

  const filters = (
    <div className="space-y-7">
      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/50">{t("cuisine")}</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((c) => (
            <Chip key={c} active={cuisine === c} onClick={() => setCuisine(c)}>
              {c === "chinese" ? "🥢 " : c === "bengali" ? "🍛 " : ""}
              {t(c)}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/50">{t("category")}</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((ty) => (
            <Chip key={ty} active={type === ty} onClick={() => setType(ty)}>
              {t(`type_${ty}`)}
            </Chip>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-between rounded-2xl bg-white p-4 ring-1 ring-leaf-100">
        <span className="font-medium">🌱 {t("vegOnly")}</span>
        <span className="relative">
          <input
            type="checkbox"
            checked={vegOnly}
            onChange={(e) => setVegOnly(e.target.checked)}
            className="peer sr-only"
          />
          <span className="block h-7 w-12 rounded-full bg-ink/10 transition peer-checked:bg-leaf-400" />
          <span className="absolute left-1 top-1 size-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
        </span>
      </label>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-ink/50">{t("maxPrice")}</h3>
          <span className="rounded-full bg-leaf-100 px-3 py-1 text-sm font-bold text-leaf-700">{price(maxPrice)}</span>
        </div>
        <input
          type="range"
          min={80}
          max={MAX_PRICE}
          step={10}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink/50">{t("maxSpice")}</h3>
        <div className="grid grid-cols-4 gap-2">
          {[0, 1, 2, 3].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setMaxSpice(lvl)}
              className={`rounded-2xl py-2.5 text-center text-xs font-medium transition ${
                maxSpice === lvl ? "bg-aqua-100 text-aqua-700 ring-2 ring-aqua-300" : "bg-white ring-1 ring-leaf-100 hover:ring-aqua-200"
              }`}
            >
              <span className="block text-sm">{lvl === 0 ? "🙂" : "🌶️".repeat(lvl)}</span>
              {lvl === 3 ? t("anySpice") : t(`spice${lvl}`)}
            </button>
          ))}
        </div>
      </div>

      {activeFilterCount > 0 && (
        <button onClick={reset} className="w-full rounded-full py-2.5 text-sm font-semibold text-rose-500 ring-1 ring-rose-200 hover:bg-rose-50">
          {t("resetFilters")}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Header */}
      <div className="relative mb-8 overflow-hidden rounded-4xl bg-linear-to-r from-leaf-100 via-white to-aqua-100 p-8 sm:p-10">
        <span className="absolute -right-2 -top-4 text-9xl opacity-80 animate-float-slow">
          {cuisine === "chinese" ? "🥡" : cuisine === "bengali" ? "🍛" : "🍽️"}
        </span>
        <h1 className="relative text-4xl font-extrabold sm:text-5xl">
          {cuisine === "all" ? t("ourMenu") : t(cuisine)}
        </h1>
        <p className="relative mt-2 text-ink/60">{t("menuSub")}</p>

        <div className="relative mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white p-2 shadow-lg shadow-aqua-100 focus-within:ring-4 focus-within:ring-aqua-100">
          <SearchIcon className="ml-3 size-5 shrink-0 text-ink/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-ink/35"
            aria-label={t("search")}
          />
          {query && (
            <button onClick={() => setQuery("")} className="rounded-full p-2 text-ink/40 hover:bg-ink/5" aria-label="Clear">
              <CloseIcon className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-3xl bg-leaf-50/60 p-5">
            <h2 className="mb-5 flex items-center gap-2 text-lg font-bold">
              <FilterIcon className="size-4" /> {t("filters")}
            </h2>
            {filters}
          </div>
        </aside>

        <div>
          {/* Toolbar */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-ink/60">
              <b className="text-ink">{num(results.length)}</b> {t("results")}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2.5 text-sm font-semibold ring-1 ring-leaf-200 lg:hidden"
              >
                <FilterIcon className="size-4" /> {t("filters")}
                {activeFilterCount > 0 && (
                  <span className="grid size-5 place-items-center rounded-full bg-leaf-400 text-[10px] text-white">
                    {num(activeFilterCount)}
                  </span>
                )}
              </button>
              <label className="sr-only" htmlFor="sort">
                {t("sortBy")}
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-full bg-white px-4 py-2.5 text-sm font-medium outline-none ring-1 ring-leaf-200 focus:ring-2 focus:ring-aqua-300"
              >
                {Object.keys(sorters).map((s) => (
                  <option key={s} value={s}>
                    {t(`sort_${s}`)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {results.length === 0 ? (
            <EmptyState emoji="🥢" title={t("noResults")} text={query ? `“${query}”` : ""}>
              <button onClick={reset} className={btnPrimary}>
                {t("resetFilters")}
              </button>
            </EmptyState>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p, i) => (
                <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setShowFilters(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-fade-up overflow-y-auto rounded-t-4xl bg-[#f5fbfa] p-6">
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-ink/15" />
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold">{t("filters")}</h2>
              <button onClick={() => setShowFilters(false)} className="rounded-full p-2 hover:bg-leaf-100" aria-label="Close">
                <CloseIcon />
              </button>
            </div>
            {filters}
            <button onClick={() => setShowFilters(false)} className={`${btnPrimary} mt-6 w-full`}>
              {num(results.length)} {t("results")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
