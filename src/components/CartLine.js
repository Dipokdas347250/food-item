"use client";

import Link from "next/link";
import { getProduct, unitPrice } from "@/data/products";
import { actions } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { TrashIcon } from "@/components/Icons";
import { FoodVisual, QtyStepper } from "@/components/ui";

export default function CartLine({ item, compact = false }) {
  const { t, price, pick } = useI18n();
  const product = getProduct(item.id);
  if (!product) return null;
  const each = unitPrice(product, item.size);

  return (
    <li className="group flex animate-pop gap-4 rounded-2xl bg-white p-3 shadow-[0_6px_24px_-14px_rgba(18,50,74,0.3)]">
      <Link href={`/menu/${product.id}`} onClick={actions.closeCart} className="shrink-0">
        <FoodVisual
          product={product}
          className={`${compact ? "size-20" : "size-24"} rounded-2xl`}
          size={compact ? "text-4xl" : "text-5xl"}
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate font-semibold text-ink">{pick(product.name)}</h4>
            <p className="text-xs text-ink/50">
              {t(item.size)} · {price(each)}
            </p>
          </div>
          <button
            onClick={() => actions.removeFromCart(item.key)}
            className="rounded-full p-1.5 text-ink/30 transition hover:bg-rose-50 hover:text-rose-500"
            aria-label={t("remove")}
          >
            <TrashIcon className="size-4" />
          </button>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <QtyStepper small value={item.qty} min={0} onChange={(q) => actions.setQty(item.key, q)} />
          <span className="font-bold text-leaf-700">{price(each * item.qty)}</span>
        </div>
      </div>
    </li>
  );
}
