"use client";

import Link from "next/link";
import { useEffect } from "react";
import { actions, computeTotals, FREE_DELIVERY_OVER, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { CloseIcon, TruckIcon } from "@/components/Icons";
import CartLine from "@/components/CartLine";
import { btnGhost, btnPrimary } from "@/components/ui";

export function FreeDeliveryBar({ subtotal }) {
  const { t, price } = useI18n();
  const pct = Math.min(100, (subtotal / FREE_DELIVERY_OVER) * 100);
  const left = FREE_DELIVERY_OVER - subtotal;
  return (
    <div className="rounded-2xl bg-linear-to-r from-leaf-50 to-aqua-50 p-3">
      <p className="mb-2 flex items-center gap-2 text-sm font-medium text-ink/75">
        <TruckIcon className="size-4 text-leaf-600" />
        {left > 0 ? (
          <span>
            <b className="text-leaf-700">{price(left)}</b> {t("freeDeliveryLeft")}
          </span>
        ) : (
          <span className="font-semibold text-leaf-700">{t("freeDeliveryUnlocked")} 🎉</span>
        )}
      </p>
      <div className="h-2 overflow-hidden rounded-full bg-white">
        <div
          className="h-full rounded-full bg-linear-to-r from-leaf-400 to-aqua-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function CartDrawer() {
  const { cart, cartOpen, coupon } = useStore();
  const { t, num, price } = useI18n();
  const totals = computeTotals(cart, coupon);

  useEffect(() => {
    if (!cartOpen) return;
    const onKey = (e) => e.key === "Escape" && actions.closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={t("yourCart")}>
      <div className="absolute inset-0 animate-[fade-up_0.3s_both] bg-ink/30 backdrop-blur-sm" onClick={actions.closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md animate-slide-in flex-col bg-[#f5fbfa] shadow-2xl">
        <header className="flex items-center justify-between border-b border-leaf-100 px-5 py-4">
          <h2 className="text-xl font-bold">
            {t("yourCart")}{" "}
            <span className="text-base font-medium text-ink/50">({num(totals.count)})</span>
          </h2>
          <button onClick={actions.closeCart} className="rounded-full p-2 hover:bg-leaf-100" aria-label="Close">
            <CloseIcon />
          </button>
        </header>

        {cart.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
            <div className="mb-4 text-7xl animate-float">🛒</div>
            <h3 className="text-lg font-bold">{t("emptyCart")}</h3>
            <p className="mt-1 text-sm text-ink/60">{t("emptyCartText")}</p>
            <Link href="/menu" onClick={actions.closeCart} className={`${btnPrimary} mt-6`}>
              {t("browseMenu")}
            </Link>
          </div>
        ) : (
          <>
            <div className="px-5 pt-4">
              <FreeDeliveryBar subtotal={totals.subtotal} />
            </div>
            <ul className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
              {cart.map((item) => (
                <CartLine key={item.key} item={item} compact />
              ))}
            </ul>
            <footer className="space-y-3 border-t border-leaf-100 bg-white px-5 py-5">
              <div className="flex justify-between text-sm text-ink/60">
                <span>{t("subtotal")}</span>
                <span>{price(totals.subtotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-leaf-600">
                  <span>{t("discount")}</span>
                  <span>-{price(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-ink/60">
                <span>{t("delivery")}</span>
                <span>{totals.delivery === 0 ? t("free") : price(totals.delivery)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span className="text-gradient">{price(totals.total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link href="/cart" onClick={actions.closeCart} className={`${btnGhost} px-3`}>
                  {t("viewCart")}
                </Link>
                <Link href="/checkout" onClick={actions.closeCart} className={`${btnPrimary} px-3`}>
                  {t("checkout")}
                </Link>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
