"use client";

import { motion } from "framer-motion";
import { ODIA_KEYBOARD } from "@/lib/odia";
import { useLocale } from "@/lib/i18n/provider";

/**
 * On-screen Odia keyboard for visitors without an Odia layout installed.
 * Keys are grouped the way a varnamala chart is: vowels, matras, consonants,
 * numerals — so the layout is learnable rather than arbitrary.
 */
export function OdiaKeyboard({
  onInsert,
  onBackspace,
  onSpace,
}: {
  onInsert: (glyph: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}) {
  const { t, pick } = useLocale();

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="overflow-hidden"
    >
      <div className="glass mt-2 rounded-2xl p-3" role="group" aria-label={t("input.keyboard")}>
        {ODIA_KEYBOARD.map((bank) => (
          <div key={bank.id} className="mb-3 last:mb-0">
            <p className="mb-1.5 text-[0.65rem] tracking-[0.2em] text-muted uppercase">
              {pick(bank.title, bank.titleOdia)}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {bank.keys.map((key) => (
                <button
                  key={`${bank.id}-${key.glyph}`}
                  type="button"
                  onClick={() => onInsert(key.glyph)}
                  aria-label={key.glyph}
                  className="font-odia glass min-w-9 rounded-lg px-2.5 py-1.5 text-base transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
                >
                  {key.glyph}
                </button>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-2 border-t border-[color:var(--line)] pt-3">
          <button
            type="button"
            onClick={onSpace}
            className="glass flex-1 rounded-lg px-3 py-2 text-xs transition-colors hover:border-[color:var(--color-gold)]"
          >
            {t("input.space")}
          </button>
          <button
            type="button"
            onClick={onBackspace}
            className="glass rounded-lg px-4 py-2 text-xs transition-colors hover:border-[color:var(--color-gold)]"
          >
            ⌫ {t("input.backspace")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
