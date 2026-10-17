"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { EmptyState, btnPrimary } from "@/components/ui";

export default function NotFound() {
  const { t } = useI18n();
  return (
    <div className="px-4">
      <EmptyState emoji="🥡" title={t("notFound")} text={t("notFoundText")}>
        <Link href="/menu" className={btnPrimary}>
          {t("browseMenu")}
        </Link>
      </EmptyState>
    </div>
  );
}
