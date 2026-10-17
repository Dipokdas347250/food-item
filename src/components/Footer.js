"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/Icons";

export default function Footer() {
  const { t, num } = useI18n();
  const year = num(2026);

  return (
    <footer className="relative mt-24 overflow-hidden bg-linear-to-br from-leaf-100 via-white to-aqua-100">
      <div className="absolute -left-20 -top-20 size-72 rounded-full bg-leaf-200/40 blur-3xl" />
      <div className="absolute -bottom-24 right-0 size-80 rounded-full bg-aqua-200/50 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2.5">
            <span className="grid size-11 place-items-center rounded-2xl bg-linear-to-br from-leaf-300 to-aqua-300 text-2xl">
              🥢
            </span>
            <div>
              <p className="text-xl font-extrabold">{t("brand")}</p>
              <p className="text-xs font-medium text-leaf-600">{t("tagline")}</p>
            </div>
          </div>
          <p className="mt-4 max-w-sm text-ink/65">{t("footerText")}</p>
          <div className="mt-5 flex gap-2 text-2xl">
            {["🍜", "🥟", "🍛", "🐟", "🍮"].map((e) => (
              <span key={e} className="grid size-11 place-items-center rounded-xl bg-white/80 shadow-sm transition hover:-translate-y-1">
                {e}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-bold">{t("quickLinks")}</h3>
          <ul className="space-y-2.5 text-ink/70">
            <li><Link className="hover:text-leaf-600" href="/menu">{t("menu")}</Link></li>
            <li><Link className="hover:text-leaf-600" href="/menu?cuisine=chinese">{t("chinese")}</Link></li>
            <li><Link className="hover:text-leaf-600" href="/menu?cuisine=bengali">{t("bengali")}</Link></li>
            <li><Link className="hover:text-leaf-600" href="/wishlist">{t("wishlist")}</Link></li>
            <li><Link className="hover:text-leaf-600" href="/track">{t("track")}</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-4 font-bold">{t("contact")}</h3>
          <ul className="space-y-3 text-ink/70">
            <li className="flex items-start gap-2.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0 text-leaf-600" />
              {t("addressLine")}
            </li>
            <li className="flex items-center gap-2.5">
              <PhoneIcon className="size-4 shrink-0 text-leaf-600" /> {num("+880 1700-000000")}
            </li>
            <li className="flex items-center gap-2.5">
              <ClockIcon className="size-4 shrink-0 text-leaf-600" /> {t("openHours")}
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-white/80 py-5 text-center text-sm text-ink/55">
        © {year} {t("brand")}. {t("rights")}
      </div>
    </footer>
  );
}
