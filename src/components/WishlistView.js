"use client";

import Link from "next/link";
import { getProduct } from "@/data/products";
import { useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import ProductCard from "@/components/ProductCard";
import { ArrowRightIcon } from "@/components/Icons";
import { EmptyState, btnPrimary } from "@/components/ui";

export default function WishlistView() {
  const { wishlist } = useStore();
  const { t, num } = useI18n();
  const items = wishlist.map(getProduct).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="px-4">
        <EmptyState emoji="💚" title={t("emptyWishlist")} text={t("emptyWishlistText")}>
          <Link href="/menu" className={btnPrimary}>
            {t("browseMenu")} <ArrowRightIcon className="size-4" />
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-4xl font-extrabold">{t("yourWishlist")}</h1>
      <p className="mt-1 mb-8 text-ink/55">
        {num(items.length)} {t("items")}
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <div key={p.id} className="animate-fade-up">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}
