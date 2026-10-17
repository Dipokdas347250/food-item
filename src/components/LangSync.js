"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";

// Keeps <html lang> in sync with the chosen language (fonts + accessibility).
export default function LangSync() {
  const { lang } = useStore();
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);
  return null;
}
