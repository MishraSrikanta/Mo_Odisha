"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { CONTACT, NAV, SITE, SOCIALS } from "@/lib/data/site";
import { useLocale } from "@/lib/i18n/provider";
import { LetterField } from "@/components/hero/LetterField";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { BilingualField } from "@/components/form/BilingualField";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, isOdia } = useLocale();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const subscribe = (event: FormEvent) => {
    event.preventDefault();
    if (!email.trim()) return;
    // No backend in this showcase — the interaction is acknowledged locally.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="relative isolate overflow-hidden border-t border-[color:var(--line)]">
      {/* Floating glowing Odia letters behind the whole footer */}
      <LetterField className="absolute inset-0 h-full w-full opacity-70" density={0.55} />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 30rem at 50% 0%, color-mix(in oklab, var(--color-gold) 12%, transparent), transparent 70%)",
        }}
        aria-hidden="true"
      />

      <Container className="relative py-20 sm:py-28">
        {/* The anthem */}
        <div className="text-center">
          <Reveal variant="blur">
            <p className="font-odia text-[clamp(2.2rem,7vw,5.5rem)] leading-[1.15] font-normal">
              <span className="gold-text">{t("footer.anthem")}</span>
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <p className="mt-3 text-lg tracking-[0.22em] text-muted uppercase sm:text-xl">{t("footer.anthemRoman")}</p>
          </Reveal>
          <Reveal variant="up" delay={0.18}>
            <p className={cn("mx-auto mt-6 max-w-2xl text-balance text-base text-muted", isOdia && "font-odia")}>
              {t("footer.anthemBody")}
            </p>
          </Reveal>
        </div>

        <div className="rule-gold my-14 h-px w-full opacity-50" aria-hidden="true" />

        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_1.4fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <span className="font-odia grid h-11 w-11 place-items-center rounded-full border border-[color:var(--color-gold)]/50 text-lg text-[color:var(--color-gold)]">
                ଓ
              </span>
              <span>
                <span className={cn("block text-lg font-medium", isOdia && "font-odia")}>{t("brand.name")}</span>
                <span className="block text-xs tracking-[0.2em] text-muted uppercase">{SITE.tagline}</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">{SITE.description}</p>

            <div className="mt-6">
              <p className="text-xs tracking-[0.24em] text-muted uppercase">{t("footer.connect")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {SOCIALS.map((social) => (
                  <li key={social.id}>
                    <a
                      href={social.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="glass block rounded-full px-4 py-2 text-xs transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
                    >
                      {social.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <nav aria-label="Footer">
            <p className="text-xs tracking-[0.24em] text-muted uppercase">{t("footer.links")}</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-[color:var(--color-gold)]",
                      isOdia && "font-odia",
                    )}
                  >
                    <span className="h-px w-0 bg-[color:var(--color-gold)] transition-all duration-300 group-hover:w-3" />
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-xs tracking-[0.24em] text-muted uppercase">{t("footer.contact")}</p>
            <address className="mt-3 text-sm not-italic text-muted">
              {CONTACT.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
              <a href={`mailto:${CONTACT.email}`} className="mt-2 block transition-colors hover:text-[color:var(--color-gold)]">
                {CONTACT.email}
              </a>
              <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="block transition-colors hover:text-[color:var(--color-gold)]">
                {CONTACT.phone}
              </a>
            </address>
          </nav>

          <div>
            <p className="text-xs tracking-[0.24em] text-muted uppercase">{t("footer.newsletter")}</p>
            <p className="mt-3 max-w-sm text-sm text-muted">{t("footer.newsletterBody")}</p>

            <form onSubmit={subscribe} className="mt-5">
              <BilingualField
                label={t("visit.form.email")}
                value={email}
                onChange={setEmail}
                type="email"
                name="newsletter-email"
                placeholder="you@example.com"
                compact
              />
              <button
                type="submit"
                className="mt-3 w-full rounded-full bg-[color:var(--color-gold)] px-6 py-3 text-sm font-medium text-[#071a34] transition-transform duration-300 hover:scale-[1.02]"
              >
                {t("footer.newsletterCta")}
              </button>
              {subscribed ? (
                <motion.p
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  className="mt-3 text-sm text-[color:var(--color-gold)]"
                >
                  ✓ {t("footer.newsletterDone")}
                </motion.p>
              ) : null}
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-3 border-t border-[color:var(--line)] pt-8 text-xs text-muted sm:flex-row">
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t("footer.rights")}
          </p>
          <p className="font-odia">ଓଡ଼ିଶା · ଭାରତ</p>
        </div>
      </Container>
    </footer>
  );
}
