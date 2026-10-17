"use client";

import Link from "next/link";
import { products } from "@/data/products";
import { useI18n } from "@/lib/i18n";
import { ArrowRightIcon } from "@/components/Icons";
import { Reveal, SectionHeading } from "@/components/ui";

const cards = [
  {
    key: "chinese",
    emojis: ["🍜", "🥟", "🍤", "🥠"],
    bg: "from-aqua-200 via-aqua-100 to-leaf-100",
    ring: "hover:shadow-aqua-200",
    accent: "text-aqua-700",
  },
  {
    key: "bengali",
    emojis: ["🍛", "🐟", "🦐", "🍮"],
    bg: "from-leaf-200 via-leaf-100 to-aqua-100",
    ring: "hover:shadow-leaf-200",
    accent: "text-leaf-700",
  },
];

export default function CuisineCards() {
  const { t, num } = useI18n();

  return (
    <section id="cuisines" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("chooseCuisine")} subtitle={t("chooseCuisineSub")} />
      </Reveal>

      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((c, i) => {
          const count = products.filter((p) => p.cuisine === c.key).length;
          return (
            <Reveal key={c.key} delay={i * 120}>
              <Link
                href={`/menu?cuisine=${c.key}`}
                className={`group relative flex h-64 overflow-hidden rounded-4xl bg-linear-to-br ${c.bg} p-8 shadow-lg shadow-transparent transition duration-500 hover:-translate-y-1 hover:shadow-2xl ${c.ring}`}
              >
                <div className="relative z-10 flex flex-col">
                  <span className={`text-sm font-semibold uppercase tracking-widest ${c.accent}`}>
                    {num(count)} {t("items")}
                  </span>
                  <h3 className="mt-2 text-4xl font-extrabold text-ink">{t(c.key)}</h3>
                  <p className="mt-2 max-w-[14rem] text-ink/65">{t(`${c.key}Desc`)}</p>
                  <span className="mt-auto inline-flex w-fit items-center gap-2 rounded-full bg-white/80 px-5 py-2.5 font-semibold text-ink shadow-sm transition group-hover:gap-3 group-hover:bg-white">
                    {t("exploreMenu")} <ArrowRightIcon className="size-4" />
                  </span>
                </div>

                <div className="absolute -right-4 top-1/2 grid -translate-y-1/2 grid-cols-2 gap-3 sm:right-6">
                  {c.emojis.map((e, j) => (
                    <span
                      key={e}
                      className="grid size-20 place-items-center rounded-3xl bg-white/60 text-5xl shadow-md backdrop-blur transition duration-500 group-hover:rotate-6 group-hover:scale-110 sm:size-24"
                      style={{ transitionDelay: `${j * 60}ms` }}
                    >
                      {e}
                    </span>
                  ))}
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
