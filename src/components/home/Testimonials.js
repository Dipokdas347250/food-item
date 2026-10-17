"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/Icons";
import { Reveal, SectionHeading, Stars } from "@/components/ui";

const reviews = [
  {
    avatar: "👩🏽",
    name: { en: "Nusrat J.", bn: "নুসরাত জে." },
    place: { en: "Dhanmondi", bn: "ধানমন্ডি" },
    rating: 5,
    text: {
      en: "The kacchi tastes exactly like Old Dhaka — and it arrived piping hot. My whole family is hooked.",
      bn: "কাচ্চির স্বাদ একদম পুরান ঢাকার মতো—আর এসেছে একদম গরম গরম। পুরো পরিবার এখন ভক্ত।",
    },
  },
  {
    avatar: "👨🏻",
    name: { en: "Arif H.", bn: "আরিফ এইচ." },
    place: { en: "Gulshan", bn: "গুলশান" },
    rating: 5,
    text: {
      en: "Best Szechuan chicken in town, and I love that I can order mishti doi in the same basket!",
      bn: "শহরের সেরা সেজুয়ান চিকেন, আর একই অর্ডারে মিষ্টি দই নিতে পারি—দারুণ!",
    },
  },
  {
    avatar: "👩🏻",
    name: { en: "Tanjila R.", bn: "তানজিলা আর." },
    place: { en: "Mirpur", bn: "মিরপুর" },
    rating: 4,
    text: {
      en: "The dumplings are so soft. Switching the site to Bangla made it super easy for my parents to order.",
      bn: "ডাম্পলিংগুলো এত নরম! সাইটটা বাংলায় করা যায় বলে বাবা-মাও সহজে অর্ডার করতে পারেন।",
    },
  },
  {
    avatar: "🧔🏽",
    name: { en: "Sabbir A.", bn: "সাব্বির এ." },
    place: { en: "Uttara", bn: "উত্তরা" },
    rating: 5,
    text: {
      en: "Shorshe ilish on a rainy day with bhuna khichuri… nothing beats it. Delivery was 25 minutes.",
      bn: "বৃষ্টির দিনে ভুনা খিচুড়ির সাথে সর্ষে ইলিশ… এর চেয়ে ভালো কিছু নেই। ২৫ মিনিটে ডেলিভারি।",
    },
  },
];

export default function Testimonials() {
  const { t, pick } = useI18n();
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setI((n) => (n + 1) % reviews.length), 5000);
    return () => clearInterval(id);
  }, [paused]);

  const go = (d) => setI((n) => (n + d + reviews.length) % reviews.length);
  const r = reviews[i];

  return (
    <section className="relative overflow-hidden py-20">
      <div className="absolute inset-0 -z-10 bg-linear-to-b from-transparent via-aqua-50 to-transparent" />
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <Reveal>
          <SectionHeading title={t("testimonialsTitle")} align="center" />
        </Reveal>

        <div
          className="relative rounded-4xl bg-white p-8 text-center shadow-xl shadow-aqua-100 sm:p-12"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <span className="absolute left-6 top-2 font-serif text-8xl leading-none text-leaf-200">“</span>
          <div key={i} className="animate-fade-up">
            <div className="mx-auto grid size-16 place-items-center rounded-full bg-linear-to-br from-leaf-100 to-aqua-100 text-4xl">
              {r.avatar}
            </div>
            <div className="mt-4 flex justify-center">
              <Stars rating={r.rating} className="size-5" />
            </div>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink/80 sm:text-xl">{pick(r.text)}</p>
            <p className="mt-5 font-bold">{pick(r.name)}</p>
            <p className="text-sm text-ink/50">{pick(r.place)}</p>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={() => go(-1)} className="rounded-full border border-leaf-200 p-2.5 hover:bg-leaf-50" aria-label="Previous">
              <ArrowLeftIcon className="size-4" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_, n) => (
                <button
                  key={n}
                  onClick={() => setI(n)}
                  aria-label={`Review ${n + 1}`}
                  className={`h-2 rounded-full transition-all ${n === i ? "w-7 bg-linear-to-r from-leaf-400 to-aqua-400" : "w-2 bg-ink/15"}`}
                />
              ))}
            </div>
            <button onClick={() => go(1)} className="rounded-full border border-leaf-200 p-2.5 hover:bg-leaf-50" aria-label="Next">
              <ArrowRightIcon className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
