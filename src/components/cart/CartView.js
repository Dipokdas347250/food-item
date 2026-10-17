"use client";

import Link from "next/link";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import CartLine from "@/components/CartLine";
import OrderSummary from "@/components/cart/OrderSummary";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { EmptyState, btnPrimary } from "@/components/ui";

export default function CartView() {
  const { cart } = useStore();
  const { t, num } = useI18n();
  const count = cart.reduce((n, i) => n + i.qty, 0);

  if (cart.length === 0) {
    return (
      <div className="px-4">
        <EmptyState emoji="🛒" title={t("emptyCart")} text={t("emptyCartText")}>
          <Link href="/menu" className={btnPrimary}>
            {t("browseMenu")} <ArrowRightIcon className="size-4" />
          </Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">{t("yourCart")}</h1>
          <p className="mt-1 text-ink/55">
            {num(count)} {t("items")}
          </p>
        </div>
        <button onClick={actions.clearCart} className="text-sm font-semibold text-rose-500 hover:underline">
          {t("clearCart")}
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div>
          <ul className="space-y-4">
            {cart.map((item) => (
              <CartLine key={item.key} item={item} />
            ))}
          </ul>
          <Link href="/menu" className="mt-6 inline-flex items-center gap-2 font-semibold text-aqua-700 hover:gap-3">
            <ArrowLeftIcon className="size-4" /> {t("continueShopping")}
          </Link>
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary>
            <Link href="/checkout" className={`${btnPrimary} w-full`}>
              {t("checkout")} <ArrowRightIcon className="size-4" />
            </Link>
          </OrderSummary>
        </aside>
      </div>
    </div>
  );
}
