"use client";

import { getProduct } from "@/data/products";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { CloseIcon } from "@/components/Icons";

export default function Toasts() {
  const { toasts } = useStore();
  const { t, pick } = useI18n();

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[60] flex flex-col items-center gap-2 px-4 sm:bottom-6 sm:items-end sm:px-6"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const product = getProduct(toast.productId);
        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex w-full max-w-sm animate-toast items-center gap-3 rounded-2xl border border-leaf-100 bg-white/95 p-3 pr-2 shadow-xl shadow-ink/10 backdrop-blur"
          >
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-linear-to-br from-leaf-100 to-aqua-100 text-2xl">
              {product?.emoji}
            </span>
            <p className="flex-1 text-sm">
              <b className="font-semibold">{pick(product?.name)}</b>{" "}
              <span className="text-ink/60">{t(toast.key)}</span>
            </p>
            {toast.key === "added" && (
              <button
                onClick={() => {
                  actions.dismissToast(toast.id);
                  actions.openCart();
                }}
                className="rounded-full bg-leaf-100 px-3 py-1.5 text-xs font-semibold text-leaf-700 hover:bg-leaf-200"
              >
                {t("cart")}
              </button>
            )}
            <button
              onClick={() => actions.dismissToast(toast.id)}
              className="rounded-full p-1 text-ink/30 hover:text-ink/60"
              aria-label="Dismiss"
            >
              <CloseIcon className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
