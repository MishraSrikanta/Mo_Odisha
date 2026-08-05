"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/data/site";
import { useLocale } from "@/lib/i18n/provider";
import { useTheme } from "@/components/providers/ThemeProvider";
import { cn } from "@/lib/utils";

/** Primary navigation: sticky, condenses on scroll, full-screen sheet on mobile. */
export function Navbar() {
  const pathname = usePathname();
  const { t, locale, setLocale, isOdia } = useLocale();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (value) => setCondensed(value > 40));

  // Close the mobile sheet whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const primary = NAV.slice(0, 8);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[120] focus:rounded-full focus:bg-[color:var(--color-gold)] focus:px-5 focus:py-2 focus:text-sm focus:text-[#071a34]"
      >
        {t("a11y.skip")}
      </a>

      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        className="fixed inset-x-0 top-0 z-[80]"
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1600px] items-center justify-between gap-4 px-5 transition-all duration-500 sm:px-8",
            condensed ? "py-2.5" : "py-5",
          )}
        >
          <div
            className={cn(
              "pointer-events-none absolute inset-0 -z-10 transition-opacity duration-500",
              condensed ? "opacity-100" : "opacity-0",
            )}
            style={{
              background: "color-mix(in oklab, var(--bg) 72%, transparent)",
              backdropFilter: "blur(18px) saturate(150%)",
              borderBottom: "1px solid var(--line)",
            }}
            aria-hidden="true"
          />

          <Link href="/" className="group flex items-center gap-3" aria-label={t("brand.name")}>
            <span className="relative grid h-10 w-10 place-items-center">
              <svg viewBox="0 0 40 40" className="absolute inset-0 h-full w-full" aria-hidden="true">
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--color-gold)" strokeWidth="1" opacity="0.55" />
                {Array.from({ length: 12 }, (_, index) => {
                  const theta = (index / 12) * Math.PI * 2;
                  return (
                    <line
                      key={index}
                      x1={20 + Math.cos(theta) * 7}
                      y1={20 + Math.sin(theta) * 7}
                      x2={20 + Math.cos(theta) * 17}
                      y2={20 + Math.sin(theta) * 17}
                      stroke="var(--color-gold)"
                      strokeWidth="0.8"
                      opacity="0.5"
                    />
                  );
                })}
              </svg>
              <span className="font-odia relative text-lg text-[color:var(--color-gold)]">ଓ</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className={cn("text-base font-medium tracking-tight", isOdia && "font-odia")}>{t("brand.name")}</span>
              <span className="mt-0.5 text-[0.6rem] tracking-[0.24em] text-muted uppercase">Odisha</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex" aria-label="Primary">
            {primary.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "relative rounded-full px-3.5 py-2 text-sm transition-colors",
                    active ? "text-[color:var(--color-gold)]" : "text-muted hover:text-[color:var(--fg)]",
                    isOdia && "font-odia",
                  )}
                >
                  {t(item.key)}
                  {active ? (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 -z-10 rounded-full"
                      style={{ background: "color-mix(in oklab, var(--color-gold) 14%, transparent)" }}
                      transition={{ type: "spring", stiffness: 320, damping: 30 }}
                    />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="glass flex items-center gap-0.5 rounded-full p-0.5" role="radiogroup" aria-label={t("a11y.language")}>
              {(["en", "or"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  role="radio"
                  aria-checked={locale === option}
                  onClick={() => setLocale(option)}
                  className={cn(
                    "rounded-full px-2.5 py-1.5 text-xs transition-colors",
                    option === "or" && "font-odia",
                    locale === option ? "bg-[color:var(--color-gold)] text-[#071a34]" : "text-muted hover:text-[color:var(--fg)]",
                  )}
                >
                  {option === "en" ? "EN" : "ଓଡ଼ିଆ"}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={t("a11y.theme")}
              className="glass grid h-9 w-9 place-items-center rounded-full transition-colors hover:border-[color:var(--color-gold)]"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                {theme === "dark" ? (
                  <path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z" strokeLinejoin="round" />
                ) : (
                  <>
                    <circle cx="12" cy="12" r="4.2" />
                    <path d="M12 2v2.4M12 19.6V22M2 12h2.4M19.6 12H22M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </button>

            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label={t("nav.open")}
              aria-expanded={open}
              className="glass grid h-9 w-9 place-items-center rounded-full transition-colors hover:border-[color:var(--color-gold)] xl:hidden"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] xl:hidden"
            style={{ background: "color-mix(in oklab, var(--bg) 94%, transparent)", backdropFilter: "blur(24px)" }}
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between px-5 py-5 sm:px-8">
                <span className={cn("text-base font-medium", isOdia && "font-odia")}>{t("nav.menu")}</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label={t("nav.close")}
                  className="glass grid h-10 w-10 place-items-center rounded-full"
                  autoFocus
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-5 pb-12 sm:px-8" aria-label="Mobile">
                <ul className="flex flex-col">
                  {NAV.map((item, index) => (
                    <motion.li
                      key={item.href}
                      initial={{ opacity: 0, x: -24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + index * 0.035, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-baseline gap-4 border-b border-[color:var(--line)] py-4 text-2xl font-light transition-colors hover:text-[color:var(--color-gold)]",
                          pathname === item.href && "text-[color:var(--color-gold)]",
                          isOdia && "font-odia",
                        )}
                      >
                        <span className="text-[0.6rem] tracking-widest text-muted">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        {t(item.key)}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </nav>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
