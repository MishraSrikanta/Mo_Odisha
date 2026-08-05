"use client";

import { useLocale } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/dictionary";
import { SectionHeading } from "./Section";

/** `SectionHeading` driven by dictionary keys, so server pages stay declarative. */
export function TranslatedHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: {
  eyebrow?: TranslationKey;
  title: TranslationKey;
  body?: TranslationKey;
  align?: "left" | "center";
  className?: string;
}) {
  const { t } = useLocale();
  return (
    <SectionHeading
      eyebrow={eyebrow ? t(eyebrow) : undefined}
      title={t(title)}
      body={body ? t(body) : undefined}
      align={align}
      className={className}
    />
  );
}
