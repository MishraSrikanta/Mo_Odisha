"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONTACT, FAQ, SOCIALS } from "@/lib/data/site";
import { useLocale } from "@/lib/i18n/provider";
import { Motif } from "@/components/ui/Motif";
import { cn } from "@/lib/utils";

/** Address, hours and direct contact lines. */
export function ContactDetails() {
  const { t, isOdia } = useLocale();

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <div className="glass ornament group relative rounded-3xl p-6">
        <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{t("visit.address")}</p>
        <address className="mt-3 text-sm leading-relaxed not-italic">
          <span className="block font-medium">{CONTACT.organisation}</span>
          {CONTACT.address.map((line) => (
            <span key={line} className="block text-muted">
              {line}
            </span>
          ))}
        </address>
      </div>

      <div className="glass ornament group relative rounded-3xl p-6">
        <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{t("visit.hours")}</p>
        <dl className="mt-3 space-y-1.5 text-sm">
          {CONTACT.hours.map((entry) => (
            <div key={entry.day} className="flex justify-between gap-4">
              <dt className="text-muted">{entry.day}</dt>
              <dd>{entry.time}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="glass ornament group relative rounded-3xl p-6">
        <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{t("visit.phone")}</p>
        <p className="mt-3 space-y-1 text-sm">
          <a href={`tel:${CONTACT.phone.replace(/\s/g, "")}`} className="block transition-colors hover:text-[color:var(--color-gold)]">
            {CONTACT.phone}
          </a>
          <a href={`tel:${CONTACT.altPhone.replace(/\s/g, "")}`} className="block text-muted transition-colors hover:text-[color:var(--color-gold)]">
            {CONTACT.altPhone}
          </a>
        </p>
      </div>

      <div className="glass ornament group relative rounded-3xl p-6">
        <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{t("visit.email")}</p>
        <p className="mt-3 space-y-1 text-sm">
          <a href={`mailto:${CONTACT.email}`} className="block transition-colors hover:text-[color:var(--color-gold)]">
            {CONTACT.email}
          </a>
          <a href={`mailto:${CONTACT.pressEmail}`} className="block text-muted transition-colors hover:text-[color:var(--color-gold)]">
            {CONTACT.pressEmail}
          </a>
        </p>
      </div>

      <div className="glass sm:col-span-2 rounded-3xl p-6">
        <p className="text-xs tracking-[0.24em] text-[color:var(--color-gold)] uppercase">{t("footer.connect")}</p>
        <ul className={cn("mt-4 flex flex-wrap gap-2", isOdia && "font-odia")}>
          {SOCIALS.map((social) => (
            <li key={social.id}>
              <a
                href={social.href}
                target="_blank"
                rel="noreferrer noopener"
                className="glass block rounded-full px-5 py-2.5 text-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
              >
                {social.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Google Maps embed.
 *
 * Uses the keyless `output=embed` endpoint and loads lazily, so the map costs
 * nothing until the visitor scrolls to it. Swap in a Maps Embed API URL with a
 * key if you need styling or Place details.
 */
export function MapEmbed() {
  const { t } = useLocale();
  const [lat, lng] = CONTACT.coords;
  const source = `https://www.google.com/maps?q=${lat},${lng}&z=14&output=embed`;

  return (
    <div className="glass shadow-soft overflow-hidden rounded-3xl">
      <div className="flex items-center justify-between gap-4 border-b border-[color:var(--line)] px-6 py-4">
        <h3 className="text-lg font-light">{t("visit.map.title")}</h3>
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`}
          target="_blank"
          rel="noreferrer noopener"
          className="text-xs text-[color:var(--color-gold)]"
        >
          {t("card.map")} ↗
        </a>
      </div>
      <iframe
        src={source}
        title={t("visit.map.title")}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-[24rem] w-full border-0"
      />
    </div>
  );
}

/**
 * Promotional film panel.
 *
 * Shows a generated poster until the visitor presses play; only then is the
 * player mounted, so nothing is fetched on page load. Drop an MP4 at
 * `/media/odisha.mp4` (or point `src` elsewhere) and it plays inline.
 */
export function VideoPanel({ src = "/media/odisha.mp4" }: { src?: string }) {
  const { t } = useLocale();
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="glass shadow-soft relative overflow-hidden rounded-3xl">
      <div className="relative aspect-video">
        {playing && !failed ? (
          <video
            src={src}
            controls
            autoPlay
            playsInline
            onError={() => setFailed(true)}
            className="h-full w-full bg-black object-cover"
          />
        ) : (
          <>
            <Motif id="visit-video" kind="wheel" className="h-full w-full" />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(to top, rgb(5 14 30 / 0.9), rgb(5 14 30 / 0.25))" }}
              aria-hidden="true"
            />
            <div className="absolute inset-0 grid place-items-center">
              <button
                type="button"
                onClick={() => setPlaying(true)}
                className="group grid h-20 w-20 place-items-center rounded-full border border-white/40 bg-white/10 backdrop-blur-md transition-transform duration-500 hover:scale-110"
                aria-label={t("visit.video.title")}
              >
                <span className="ml-1 block h-0 w-0 border-y-[12px] border-l-[20px] border-y-transparent border-l-white" />
              </button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6">
              <h3 className="text-2xl font-light text-white">{t("visit.video.title")}</h3>
              {failed ? (
                <p className="mt-1 text-xs text-white/70">
                  No film is bundled with this showcase — add one at <code>{src}</code>.
                </p>
              ) : null}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/** Accessible FAQ accordion. */
export function Faq() {
  const { t, pick, isOdia } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-10 divide-y divide-[color:var(--line)] border-y border-[color:var(--line)]">
      {FAQ.map((entry, index) => {
        const expanded = open === index;
        const panelId = `faq-panel-${index}`;
        const buttonId = `faq-button-${index}`;

        return (
          <div key={entry.q}>
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={expanded}
                aria-controls={panelId}
                onClick={() => setOpen(expanded ? null : index)}
                className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-[color:var(--color-gold)]"
              >
                <span className={cn("text-lg font-light sm:text-xl", isOdia && "font-odia")}>
                  {pick(entry.q, entry.qOr)}
                </span>
                <span
                  className={cn(
                    "shrink-0 text-xl text-[color:var(--color-gold)] transition-transform duration-500",
                    expanded && "rotate-45",
                  )}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {expanded ? (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <p className="max-w-3xl pb-6 text-sm leading-relaxed text-muted sm:text-base">{entry.a}</p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
