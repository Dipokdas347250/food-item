"use client";

import Link from "next/link";
import { useState } from "react";
import { products } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/Icons";
import { Reveal, SectionHeading } from "@/components/ui";

const tabs = ["all", "chinese", "bengali"];

export default function PopularDishes() {
  const { t } = useI18n();
  const [tab, setTab] = useState("all");

  const list = products
    .filter((p) => tab === "all" || p.cuisine === tab)
    .sort((a, b) => b.rating * b.reviews - a.rating * a.reviews)
    .slice(0, 8);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("popularDishes")} subtitle={t("popularSub")}>
          <div className="flex items-center gap-3">
            <div className="flex rounded-full bg-white p-1 shadow-sm" role="tablist">
              {tabs.map((k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={tab === k}
                  onClick={() => setTab(k)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === k ? "bg-linear-to-r from-leaf-400 to-aqua-400 text-white shadow" : "text-ink/60 hover:text-ink"
                  }`}
                >
                  {t(k)}
                </button>
              ))}
            </div>
            <Link
              href="/menu"
              className="hidden items-center gap-1 text-sm font-semibold text-aqua-700 hover:gap-2 hover:text-aqua-600 sm:flex"
            >
              {t("viewAll")} <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </SectionHeading>
      </Reveal>

      <div key={tab} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {list.map((p, i) => (
          <div key={p.id} className="animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
