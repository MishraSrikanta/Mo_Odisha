"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, LOCALES, type Locale, type TranslationKey } from "./dictionary";

const STORAGE_KEY = "mo-odisha.locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  /** Translate a UI key. */
  t: (key: TranslationKey) => string;
  /** Pick between an English and an Odia value from the content layer. */
  pick: <T>(english: T, odia: T | undefined) => T;
  isOdia: boolean;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as string[]).includes(value);
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  // Read the persisted choice after mount so the server HTML stays cacheable.
  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (isLocale(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "or" ? "or" : "en";
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
  }, []);

  const value = useMemo<LocaleContextValue>(() => {
    const dictionary = dictionaries[locale];
    return {
      locale,
      setLocale,
      toggleLocale: () => setLocale(locale === "en" ? "or" : "en"),
      t: (key) => dictionary[key] ?? dictionaries.en[key] ?? key,
      pick: (english, odia) => (locale === "or" && odia !== undefined ? odia : english),
      isOdia: locale === "or",
    };
  }, [locale, setLocale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside <LocaleProvider>");
  return context;
}

/** Convenience hook for components that only need the translate function. */
export function useT() {
  return useLocale().t;
}
