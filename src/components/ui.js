"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { MinusIcon, PlusIcon, StarIcon } from "@/components/Icons";

// Soft gradient tile with a big dish emoji. Chinese = blue-leaning, Bengali = green-leaning.
export function FoodVisual({ product, className = "", size = "text-7xl", float = false }) {
  const bg =
    product.cuisine === "chinese"
      ? "from-aqua-100 via-aqua-50 to-leaf-100"
      : "from-leaf-100 via-leaf-50 to-aqua-100";
  return (
    <div className={`relative grid place-items-center overflow-hidden bg-linear-to-br ${bg} ${className}`}>
      <div className="absolute -right-6 -top-6 size-28 rounded-full bg-white/50" />
      <div className="absolute -bottom-10 -left-8 size-32 rounded-full bg-white/40" />
      <span
        className={`relative select-none drop-shadow-[0_12px_18px_rgba(18,50,74,0.25)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6 ${size} ${
          float ? "animate-float" : ""
        }`}
      >
        {product.emoji}
      </span>
    </div>
  );
}

export function Stars({ rating, className = "size-4" }) {
  return (
    <span className="flex items-center gap-0.5 text-amber-400">
      {[1, 2, 3, 4, 5].map((i) => (
        <StarIcon key={i} filled={rating >= i - 0.25} className={className} />
      ))}
    </span>
  );
}

export function SpiceMeter({ level, showLabel = false }) {
  const { t } = useI18n();
  return (
    <span className="inline-flex items-center gap-1" title={t(`spice${level}`)}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={`text-sm ${i <= level ? "" : "opacity-20 grayscale"}`}>
          🌶️
        </span>
      ))}
      {showLabel && <span className="ml-1 text-xs font-medium text-ink/60">{t(`spice${level}`)}</span>}
    </span>
  );
}

export function QtyStepper({ value, onChange, min = 1, max = 20, small = false }) {
  const { num } = useI18n();
  const btn = small ? "size-7" : "size-10";
  return (
    <div className="inline-flex items-center rounded-full border border-leaf-200 bg-white p-1">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={value <= min && min > 0}
        className={`${btn} grid place-items-center rounded-full text-leaf-700 transition hover:bg-leaf-100 active:scale-90 disabled:opacity-30`}
        aria-label="Decrease"
      >
        <MinusIcon className="size-4" />
      </button>
      <span className={`${small ? "w-7 text-sm" : "w-10"} text-center font-semibold tabular-nums`}>{num(value)}</span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        className={`${btn} grid place-items-center rounded-full bg-leaf-400 text-white transition hover:bg-leaf-500 active:scale-90 disabled:opacity-30`}
        aria-label="Increase"
      >
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
}

// Fades children in when scrolled into view.
export function Reveal({ children, className = "", delay = 0, as: Tag = "div" }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`${className} ${visible ? "animate-fade-up" : "opacity-0"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}

export function SectionHeading({ eyebrow, title, subtitle, align = "left", children }) {
  return (
    <div
      className={`mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between ${
        align === "center" ? "text-center sm:flex-col sm:items-center" : ""
      }`}
    >
      <div>
        {eyebrow && (
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-leaf-600">{eyebrow}</p>
        )}
        <h2 className="text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-ink/60">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}

export function EmptyState({ emoji, title, text, children }) {
  return (
    <div className="mx-auto flex max-w-md animate-pop flex-col items-center py-16 text-center">
      <div className="mb-5 grid size-28 place-items-center rounded-full bg-linear-to-br from-leaf-100 to-aqua-100 text-6xl">
        <span className="animate-float">{emoji}</span>
      </div>
      <h2 className="text-2xl font-bold">{title}</h2>
      <p className="mt-2 text-ink/60">{text}</p>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-full bg-linear-to-r from-leaf-400 to-aqua-400 px-6 py-3 font-semibold text-white shadow-lg shadow-leaf-200/70 transition hover:shadow-xl hover:brightness-105 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60";

export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-aqua-200 bg-white/70 px-6 py-3 font-semibold text-aqua-700 transition hover:border-aqua-300 hover:bg-aqua-50 active:scale-[0.97]";
