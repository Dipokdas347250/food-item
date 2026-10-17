"use client";

import { useI18n } from "@/lib/i18n";
import { Reveal, SectionHeading } from "@/components/ui";

const steps = [
  { emoji: "📱", key: "step1", color: "from-aqua-100 to-aqua-200" },
  { emoji: "👨‍🍳", key: "step2", color: "from-leaf-100 to-leaf-200" },
  { emoji: "🛵", key: "step3", color: "from-aqua-100 to-leaf-200" },
];

export default function HowItWorks() {
  const { t, num } = useI18n();
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <Reveal>
        <SectionHeading title={t("howTitle")} align="center" />
      </Reveal>
      <div className="relative grid gap-6 md:grid-cols-3">
        <div className="absolute left-[16%] right-[16%] top-14 hidden border-t-2 border-dashed border-leaf-200 md:block" />
        {steps.map((s, i) => (
          <Reveal key={s.key} delay={i * 150}>
            <div className="group relative flex flex-col items-center rounded-3xl bg-white p-8 text-center shadow-[0_10px_40px_-20px_rgba(18,50,74,0.3)] transition hover:-translate-y-1">
              <span className={`relative grid size-20 place-items-center rounded-3xl bg-linear-to-br ${s.color} text-4xl transition group-hover:scale-110 group-hover:rotate-6`}>
                {s.emoji}
                <span className="absolute -right-2 -top-2 grid size-7 place-items-center rounded-full bg-ink text-xs font-bold text-white">
                  {num(i + 1)}
                </span>
              </span>
              <h3 className="mt-5 text-xl font-bold">{t(s.key)}</h3>
              <p className="mt-2 text-ink/60">{t(`${s.key}d`)}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
