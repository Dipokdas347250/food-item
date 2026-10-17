"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { getProduct, unitPrice } from "@/data/products";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import OrderSummary from "@/components/cart/OrderSummary";
import { ArrowRightIcon, CheckIcon } from "@/components/Icons";
import { EmptyState, btnPrimary } from "@/components/ui";

const areas = [
  { en: "Dhanmondi", bn: "ধানমন্ডি" },
  { en: "Gulshan", bn: "গুলশান" },
  { en: "Banani", bn: "বনানী" },
  { en: "Uttara", bn: "উত্তরা" },
  { en: "Mirpur", bn: "মিরপুর" },
  { en: "Mohammadpur", bn: "মোহাম্মদপুর" },
  { en: "Bashundhara", bn: "বসুন্ধরা" },
  { en: "Old Dhaka", bn: "পুরান ঢাকা" },
];

const payments = [
  { id: "cod", icon: "💵" },
  { id: "bkash", icon: "📲" },
  { id: "nagad", icon: "📱" },
  { id: "card", icon: "💳" },
];

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-ink/70">{label}</span>
      {children}
      {error && <span className="mt-1.5 block animate-pop text-xs font-medium text-rose-500">{error}</span>}
    </label>
  );
}

const inputCls = (err) =>
  `w-full rounded-2xl bg-white px-4 py-3 outline-none ring-1 transition placeholder:text-ink/35 focus:ring-4 ${
    err ? "ring-rose-300 focus:ring-rose-100" : "ring-leaf-100 focus:ring-aqua-100 focus:ring-offset-0"
  }`;

export default function CheckoutView() {
  const { cart } = useStore();
  const { t, num, price, pick } = useI18n();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", phone: "", area: "", address: "", note: "", when: "asap", payment: "cod" });
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);

  const update = (key) => (e) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (errors[key]) setErrors((er) => ({ ...er, [key]: null }));
  };

  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = t("errName");
    if (!/^01[3-9]\d{8}$/.test(form.phone.replace(/[\s-]/g, ""))) e.phone = t("errPhone");
    if (!form.area) e.area = t("errArea");
    if (form.address.trim().length < 5) e.address = t("errAddress");
    return e;
  }

  function submit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    setPlacing(true);
    setTimeout(() => {
      const id = actions.placeOrder(form);
      router.push(`/track?id=${id}&new=1`);
    }, 1500);
  }

  if (placing) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-4">
        <div className="flex flex-col items-center text-center">
          <div className="relative grid size-28 place-items-center">
            <span className="absolute inset-0 animate-spin rounded-full border-4 border-leaf-100 border-t-leaf-400 border-r-aqua-400" />
            <span className="text-5xl animate-float">👨‍🍳</span>
          </div>
          <p className="mt-6 text-lg font-semibold">{t("placing")}</p>
        </div>
      </div>
    );
  }

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
      <h1 className="mb-8 text-4xl font-extrabold">{t("checkout")}</h1>

      <form onSubmit={submit} noValidate className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {/* Delivery details */}
          <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)] sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
              <span className="grid size-8 place-items-center rounded-full bg-leaf-100 text-sm text-leaf-700">{num(1)}</span>
              {t("deliveryDetails")}
            </h2>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label={t("fullName")} error={errors.name}>
                <input value={form.name} onChange={update("name")} className={inputCls(errors.name)} autoComplete="name" />
              </Field>
              <Field label={t("phone")} error={errors.phone}>
                <input
                  value={form.phone}
                  onChange={update("phone")}
                  className={inputCls(errors.phone)}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  autoComplete="tel"
                />
              </Field>
              <Field label={t("area")} error={errors.area}>
                <select value={form.area} onChange={update("area")} className={inputCls(errors.area)}>
                  <option value="">{t("selectArea")}</option>
                  {areas.map((a) => (
                    <option key={a.en} value={a.en}>
                      {pick(a)}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={t("deliveryTime")}>
                <div className="grid grid-cols-2 gap-2">
                  {["asap", "scheduled"].map((w) => (
                    <button
                      type="button"
                      key={w}
                      onClick={() => setForm((f) => ({ ...f, when: w }))}
                      className={`rounded-2xl px-3 py-3 text-sm font-medium transition ${
                        form.when === w ? "bg-aqua-100 text-aqua-700 ring-2 ring-aqua-300" : "bg-white ring-1 ring-leaf-100"
                      }`}
                    >
                      {w === "asap" ? "⚡ " : "🕒 "}
                      {t(w)}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="sm:col-span-2">
                <Field label={t("address")} error={errors.address}>
                  <textarea rows={2} value={form.address} onChange={update("address")} className={inputCls(errors.address)} autoComplete="street-address" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label={t("note")}>
                  <input value={form.note} onChange={update("note")} placeholder={t("notePlaceholder")} className={inputCls(false)} />
                </Field>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl bg-white p-6 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)] sm:p-8">
            <h2 className="mb-6 flex items-center gap-3 text-xl font-bold">
              <span className="grid size-8 place-items-center rounded-full bg-aqua-100 text-sm text-aqua-700">{num(2)}</span>
              {t("payment")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {payments.map((p) => {
                const active = form.payment === p.id;
                return (
                  <label
                    key={p.id}
                    className={`relative flex cursor-pointer items-center gap-3 rounded-2xl p-4 transition ${
                      active ? "bg-leaf-50 ring-2 ring-leaf-400" : "bg-[#f7fcfb] ring-1 ring-leaf-100 hover:ring-leaf-200"
                    }`}
                  >
                    <input type="radio" name="payment" value={p.id} checked={active} onChange={update("payment")} className="sr-only" />
                    <span className="grid size-11 place-items-center rounded-xl bg-white text-2xl shadow-sm">{p.icon}</span>
                    <span className="font-semibold">{t(p.id)}</span>
                    {active && (
                      <span className="absolute right-4 grid size-6 animate-pop place-items-center rounded-full bg-leaf-400 text-white">
                        <CheckIcon className="size-3.5" />
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
            <p className="mt-4 text-xs text-ink/45">🔒 {t("secureNote")}</p>
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl bg-white p-5 shadow-[0_10px_40px_-18px_rgba(18,50,74,0.25)]">
            <ul className="max-h-64 space-y-3 overflow-y-auto pr-1">
              {cart.map((item) => {
                const p = getProduct(item.id);
                if (!p) return null;
                return (
                  <li key={item.key} className="flex items-center gap-3">
                    <span className="relative grid size-12 shrink-0 place-items-center rounded-xl bg-linear-to-br from-leaf-100 to-aqua-100 text-2xl">
                      {p.emoji}
                      <span className="absolute -right-1.5 -top-1.5 grid size-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-white">
                        {num(item.qty)}
                      </span>
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">{pick(p.name)}</span>
                      <span className="text-xs text-ink/50">{t(item.size)}</span>
                    </span>
                    <span className="text-sm font-semibold">{price(unitPrice(p, item.size) * item.qty)}</span>
                  </li>
                );
              })}
            </ul>
          </div>
          <OrderSummary>
            <button type="submit" className={`${btnPrimary} w-full py-4 text-lg`}>
              {t("placeOrder")} <ArrowRightIcon className="size-5" />
            </button>
          </OrderSummary>
        </aside>
      </form>
    </div>
  );
}
