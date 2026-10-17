"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { Reveal } from "@/components/ui";

export default function Newsletter() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) return;
    setDone(true);
    setEmail("");
  }

  return (
    <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
      <Reveal>
        <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-12 text-center sm:px-12">
          <div className="absolute -left-10 -top-10 size-60 rounded-full bg-leaf-400/30 blur-3xl" />
          <div className="absolute -bottom-10 -right-10 size-60 rounded-full bg-aqua-400/30 blur-3xl" />
          <div className="relative">
            <div className="text-5xl">💌</div>
            <h2 className="mt-4 text-3xl font-extrabold text-white sm:text-4xl">{t("newsTitle")}</h2>
            <p className="mx-auto mt-3 max-w-lg text-white/70">{t("newsText")}</p>
            {done ? (
              <p className="mx-auto mt-8 w-fit animate-pop rounded-full bg-leaf-400/20 px-6 py-3 font-semibold text-leaf-200">
                {t("subscribed")}
              </p>
            ) : (
              <form onSubmit={submit} className="mx-auto mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("emailPlaceholder")}
                  className="flex-1 rounded-full border border-white/15 bg-white/10 px-5 py-3 text-white outline-none placeholder:text-white/40 focus:border-leaf-300 focus:ring-4 focus:ring-leaf-400/20"
                />
                <button className="rounded-full bg-linear-to-r from-leaf-300 to-aqua-300 px-6 py-3 font-semibold text-ink transition hover:brightness-105 active:scale-95">
                  {t("subscribe")}
                </button>
              </form>
            )}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
