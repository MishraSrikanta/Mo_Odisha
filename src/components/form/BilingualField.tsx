"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useId, useMemo, useRef, useState } from "react";
import { OdiaKeyboard } from "./OdiaKeyboard";
import { useLocale } from "@/lib/i18n/provider";
import { suggestOdiaWords, transliterateToOdia, type OdiaWord } from "@/lib/odia";
import { cn } from "@/lib/utils";

export type FieldLanguage = "en" | "or";

type BilingualFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  name?: string;
  type?: "text" | "email" | "search" | "tel";
  multiline?: boolean;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  /** Hide the keyboard/copy row for compact uses like a search box. */
  compact?: boolean;
  defaultLanguage?: FieldLanguage;
};

/**
 * A text field with its own language switch.
 *
 * In Odia mode the field is a live transliteration IME: Roman keystrokes are
 * converted as you type ("odisha" → ଓଦିଶ). The trick is that we keep the
 * *committed* text separate from the Roman spelling of the word currently being
 * typed, so backspace walks back through the Roman source rather than stranding
 * half a conjunct — and switching language mid-sentence never destroys what is
 * already there.
 *
 * Also provides a virtual Odia keyboard, word suggestions, and copy-out — so a
 * visitor with no Odia keyboard layout can still write Odia comfortably.
 */
export function BilingualField({
  label,
  value,
  onChange,
  name,
  type = "text",
  multiline = false,
  rows = 5,
  placeholder,
  required = false,
  error,
  className,
  compact = false,
  defaultLanguage = "en",
}: BilingualFieldProps) {
  const { t, locale } = useLocale();
  const fieldId = useId();
  const errorId = `${fieldId}-error`;
  const hintId = `${fieldId}-hint`;

  const [language, setLanguage] = useState<FieldLanguage>(defaultLanguage);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  /**
   * Everything before the word in progress. `committed + transliterate(roman)`
   * always equals the visible value while typing in Odia.
   */
  const committedRef = useRef(value);
  const romanRef = useRef("");

  const resync = useCallback((next: string) => {
    committedRef.current = next;
    romanRef.current = "";
  }, []);

  const emit = useCallback(() => {
    onChange(committedRef.current + transliterateToOdia(romanRef.current));
  }, [onChange]);

  const handleChange = useCallback(
    (next: string) => {
      if (language === "en") {
        resync(next);
        onChange(next);
        return;
      }

      const current = committedRef.current + transliterateToOdia(romanRef.current);

      // Character appended at the end — the common case.
      if (next.length > current.length && next.startsWith(current)) {
        const typed = next.slice(current.length);
        for (const character of typed) {
          if (/[\s.,!?;:'"()\-\n]/.test(character)) {
            committedRef.current += transliterateToOdia(romanRef.current) + character;
            romanRef.current = "";
          } else {
            romanRef.current += character;
          }
        }
        emit();
        return;
      }

      // Deletion from the end — walk back through the Roman source first.
      if (next.length < current.length && current.startsWith(next)) {
        if (romanRef.current.length > 0) {
          romanRef.current = romanRef.current.slice(0, -1);
          emit();
          return;
        }
        resync(next);
        onChange(next);
        return;
      }

      // Paste, or an edit in the middle: accept it verbatim and start fresh.
      resync(next);
      onChange(next);
    },
    [language, emit, onChange, resync],
  );

  const insertGlyph = useCallback(
    (glyph: string) => {
      // Virtual-keyboard input is already Odia — commit the pending Roman first.
      committedRef.current += transliterateToOdia(romanRef.current) + glyph;
      romanRef.current = "";
      onChange(committedRef.current);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const backspace = useCallback(() => {
    if (romanRef.current.length > 0) {
      romanRef.current = romanRef.current.slice(0, -1);
    } else {
      committedRef.current = committedRef.current.slice(0, -1);
    }
    emit();
    inputRef.current?.focus();
  }, [emit]);

  const switchLanguage = useCallback(
    (next: FieldLanguage) => {
      // Commit whatever is mid-word so the text survives the switch intact.
      committedRef.current = committedRef.current + transliterateToOdia(romanRef.current);
      romanRef.current = "";
      onChange(committedRef.current);
      setLanguage(next);
      if (next === "en") setKeyboardOpen(false);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const suggestions: OdiaWord[] = useMemo(() => {
    if (language !== "or") return [];
    const fragment = romanRef.current || value.split(/\s+/).pop() || "";
    return suggestOdiaWords(fragment, 5);
  }, [language, value]);

  const applySuggestion = useCallback(
    (word: OdiaWord) => {
      // Replace the word in progress with the chosen one.
      const trimmed = romanRef.current
        ? committedRef.current
        : committedRef.current.replace(/\S+$/, "");
      committedRef.current = `${trimmed}${word.odia} `;
      romanRef.current = "";
      onChange(committedRef.current);
      inputRef.current?.focus();
    },
    [onChange],
  );

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied — the field text is still selectable.
    }
  }, [value]);

  const isOdiaField = language === "or";
  const shared = {
    id: fieldId,
    name,
    value,
    placeholder,
    required,
    "aria-invalid": Boolean(error) || undefined,
    "aria-describedby": cn(error ? errorId : undefined, hintId) || undefined,
    onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => handleChange(event.target.value),
    className: cn(
      "w-full rounded-xl bg-transparent px-4 py-3 text-base outline-none transition-colors placeholder:text-muted/70",
      "border border-[color:var(--line)] focus:border-[color:var(--color-gold)]",
      isOdiaField && "font-odia",
      error && "border-red-400/70",
    ),
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={fieldId} className={cn("text-sm font-medium", locale === "or" && "font-odia")}>
          {label}
          {required ? <span className="ml-1 text-[color:var(--color-gold)]">*</span> : null}
        </label>

        <div
          className="glass flex items-center gap-0.5 rounded-full p-0.5"
          role="radiogroup"
          aria-label={`${t("input.lang")} — ${label}`}
        >
          {(["en", "or"] as const).map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={language === option}
              onClick={() => switchLanguage(option)}
              className={cn(
                "rounded-full px-2.5 py-1 text-[0.7rem] transition-colors",
                option === "or" && "font-odia",
                language === option
                  ? "bg-[color:var(--color-gold)] text-[#071a34]"
                  : "text-muted hover:text-[color:var(--fg)]",
              )}
            >
              {option === "en" ? "EN" : "ଓଡ଼ିଆ"}
            </button>
          ))}
        </div>
      </div>

      {multiline ? (
        <textarea {...shared} rows={rows} ref={inputRef as React.Ref<HTMLTextAreaElement>} />
      ) : (
        <input {...shared} type={type} ref={inputRef as React.Ref<HTMLInputElement>} />
      )}

      <p id={hintId} className="mt-1.5 text-xs text-muted">
        {isOdiaField ? t("input.hintOdia") : t("input.hintEnglish")}
      </p>

      {error ? (
        <p id={errorId} role="alert" className="mt-1 text-xs text-red-400">
          {error}
        </p>
      ) : null}

      {!compact ? (
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {isOdiaField ? (
            <button
              type="button"
              onClick={() => setKeyboardOpen((open) => !open)}
              aria-expanded={keyboardOpen}
              className="glass rounded-full px-3 py-1.5 text-xs transition-colors hover:border-[color:var(--color-gold)]"
            >
              ⌨ {keyboardOpen ? t("input.keyboardClose") : t("input.keyboardOpen")}
            </button>
          ) : null}
          <button
            type="button"
            onClick={copy}
            disabled={!value}
            className="glass rounded-full px-3 py-1.5 text-xs transition-colors hover:border-[color:var(--color-gold)] disabled:opacity-40"
          >
            {copied ? `✓ ${t("input.copied")}` : t("input.copy")}
          </button>
        </div>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[0.65rem] tracking-[0.18em] text-muted uppercase">{t("input.suggestions")}</span>
          {suggestions.map((word) => (
            <button
              key={word.odia}
              type="button"
              onClick={() => applySuggestion(word)}
              title={`${word.roman} — ${word.en}`}
              className="font-odia glass rounded-full px-2.5 py-1 text-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
            >
              {word.odia}
            </button>
          ))}
        </div>
      ) : null}

      <AnimatePresence>
        {keyboardOpen && isOdiaField ? (
          <OdiaKeyboard onInsert={insertGlyph} onBackspace={backspace} onSpace={() => insertGlyph(" ")} />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
