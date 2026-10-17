"use client";

import { useState } from "react";
import { actions, computeTotals, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { CheckIcon, CloseIcon, TagIcon } from "@/components/Icons";
import { FreeDeliveryBar } from "@/components/CartDrawer";

export default function OrderSummary({ children, showCoupon = true }) {
  const { cart, coupon } = useStore();
  const { t, price } = useI18n();
  const totals = computeTotals(cart, coupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  // Plain div + Enter handler (not a <form>) so this can sit inside the checkout form.
  function apply() {
    if (!code.trim()) return;
    const ok = actions.applyCoupon(code);
    setError(!ok);
    if (ok) setCode("");
  }

  return (
    <div className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)]">
      <h2 className="mb-5 text-xl font-bold">{t("orderSummary")}</h2>

      <FreeDeliveryBar subtotal={totals.subtotal} />

      {showCoupon && (
        <div className="mt-5">
          {coupon ? (
            <div className="flex items-center justify-between rounded-2xl bg-leaf-50 px-4 py-3 ring-1 ring-leaf-200">
              <span className="flex items-center gap-2 text-sm font-semibold text-leaf-700">
                <CheckIcon className="size-4" /> {t("couponApplied")}: {coupon}
              </span>
              <button onClick={actions.removeCoupon} className="rounded-full p-1 text-leaf-700 hover:bg-leaf-100" aria-label={t("remove")}>
                <CloseIcon className="size-4" />
              </button>
            </div>
          ) : (
            <div>
              <div className={`flex gap-2 rounded-full bg-[#f5fbfa] p-1.5 ring-1 ${error ? "ring-rose-300" : "ring-leaf-100"}`}>
                <TagIcon className="my-auto ml-3 size-4 text-ink/40" />
                <input
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value);
                    setError(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      apply();
                    }
                  }}
                  placeholder={t("coupon")}
                  className="min-w-0 flex-1 bg-transparent text-sm uppercase outline-none placeholder:normal-case placeholder:text-ink/40"
                />
                <button type="button" onClick={apply} disabled={!code.trim()} className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white disabled:opacity-40">
                  {t("apply")}
                </button>
              </div>
              <p className={`mt-2 px-3 text-xs ${error ? "text-rose-500" : "text-ink/45"}`}>
                {error ? t("couponInvalid") : t("couponHint")}
              </p>
            </div>
          )}
        </div>
      )}

      <dl className="mt-5 space-y-3 border-t border-dashed border-leaf-200 pt-5 text-sm">
        <div className="flex justify-between text-ink/65">
          <dt>{t("subtotal")}</dt>
          <dd>{price(totals.subtotal)}</dd>
        </div>
        {totals.discount > 0 && (
          <div className="flex justify-between font-medium text-leaf-600">
            <dt>{t("discount")}</dt>
            <dd>-{price(totals.discount)}</dd>
          </div>
        )}
        <div className="flex justify-between text-ink/65">
          <dt>{t("delivery")}</dt>
          <dd className={totals.delivery === 0 ? "font-semibold text-leaf-600" : ""}>
            {totals.delivery === 0 ? t("free") : price(totals.delivery)}
          </dd>
        </div>
        <div className="flex justify-between border-t border-leaf-100 pt-3 text-lg font-extrabold">
          <dt>{t("total")}</dt>
          <dd className="text-gradient">{price(totals.total)}</dd>
        </div>
      </dl>

      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
