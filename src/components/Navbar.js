"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { actions, useStore } from "@/lib/store";
import { useI18n } from "@/lib/i18n";
import { CartIcon, CloseIcon, GlobeIcon, HeartIcon, MenuIcon } from "@/components/Icons";

export default function Navbar() {
  const { cart, wishlist } = useStore();
  const { t, num } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);

  // close the mobile menu after navigating
  if (openedAt !== pathname) {
    setOpenedAt(pathname);
    setMobileOpen(false);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const count = cart.reduce((n, i) => n + i.qty, 0);

  const links = [
    { href: "/", label: t("home") },
    { href: "/menu", label: t("menu") },
    { href: "/menu?cuisine=chinese", label: t("chinese") },
    { href: "/menu?cuisine=bengali", label: t("bengali") },
    { href: "/track", label: t("track") },
  ];

  const isActive = (href) => (href === "/" ? pathname === "/" : pathname === href.split("?")[0] && !href.includes("?"));

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled ? "glass shadow-[0_8px_30px_-12px_rgba(18,50,74,0.18)]" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:h-20">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="grid size-10 place-items-center rounded-2xl bg-linear-to-br from-leaf-300 to-aqua-300 text-xl shadow-lg shadow-leaf-200 transition-transform group-hover:rotate-12">
            🥢
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-ink">{t("brand")}</span>
            <span className="hidden text-[11px] font-medium text-leaf-600 sm:block">{t("tagline")}</span>
          </span>
        </Link>

        <ul className="ml-6 hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isActive(l.href)
                    ? "bg-leaf-100 text-leaf-700"
                    : "text-ink/70 hover:bg-aqua-50 hover:text-aqua-700"
                }`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={actions.toggleLang}
            className="flex items-center gap-1.5 rounded-full border border-aqua-200 bg-white/70 px-3 py-2 text-sm font-semibold text-aqua-700 transition hover:border-aqua-300 hover:bg-aqua-50"
            aria-label="Switch language"
          >
            <GlobeIcon className="size-4" />
            {t("langSwitch")}
          </button>

          <Link
            href="/wishlist"
            className="relative hidden rounded-full p-2.5 text-ink/70 transition hover:bg-leaf-50 hover:text-leaf-600 sm:block"
            aria-label={t("wishlist")}
          >
            <HeartIcon className="size-5" />
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid min-w-5 place-items-center rounded-full bg-rose-400 px-1 text-[10px] font-bold text-white">
                {num(wishlist.length)}
              </span>
            )}
          </Link>

          <button
            onClick={actions.openCart}
            className="relative flex items-center gap-2 rounded-full bg-linear-to-r from-leaf-400 to-aqua-400 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-aqua-200 transition hover:shadow-xl hover:brightness-105 active:scale-95"
            aria-label={t("cart")}
          >
            <CartIcon className="size-5" />
            <span className="hidden sm:inline">{t("cart")}</span>
            {count > 0 && (
              <span
                key={count}
                className="grid min-w-5 animate-pop place-items-center rounded-full bg-white px-1 text-[11px] font-bold text-leaf-700"
              >
                {num(count)}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="rounded-full p-2.5 text-ink/80 hover:bg-leaf-50 lg:hidden"
            aria-label="Menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="glass mx-4 mb-3 animate-pop rounded-3xl p-3 shadow-xl lg:hidden">
          {[...links, { href: "/wishlist", label: t("wishlist") }].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="block rounded-2xl px-4 py-3 font-medium text-ink/80 hover:bg-leaf-50 hover:text-leaf-700"
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
