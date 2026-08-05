"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { BilingualField } from "@/components/form/BilingualField";
import { useLocale } from "@/lib/i18n/provider";
import { cn } from "@/lib/utils";

type Status = "idle" | "sending" | "sent";

/**
 * Contact form. Every field carries its own Odia/English typing switch, so a
 * visitor can write their name in Odia and the subject in English in the same
 * submission.
 *
 * There is no backend in this showcase: submission is validated client-side and
 * acknowledged locally. Point `onSubmit` at a route handler or form service to
 * make it live.
 */
export function ContactForm() {
  const { t, isOdia } = useLocale();
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<Status>("idle");

  const set = (key: keyof typeof values) => (value: string) =>
    setValues((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = t("visit.form.error");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = t("visit.form.error");
    if (values.message.trim().length < 8) next.message = t("visit.form.error");
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    setStatus("sending");
    // Stand-in for a real submission round-trip.
    await new Promise((resolve) => setTimeout(resolve, 700));
    setStatus("sent");
    setValues({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <form onSubmit={submit} noValidate className="glass shadow-soft rounded-3xl p-6 sm:p-8">
      <h3 className={cn("text-2xl font-light", isOdia && "font-odia")}>{t("visit.form.title")}</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <BilingualField
          label={t("visit.form.name")}
          value={values.name}
          onChange={set("name")}
          name="name"
          required
          error={errors.name}
        />
        <BilingualField
          label={t("visit.form.email")}
          value={values.email}
          onChange={set("email")}
          name="email"
          type="email"
          required
          error={errors.email}
          compact
        />
      </div>

      <div className="mt-5">
        <BilingualField label={t("visit.form.subject")} value={values.subject} onChange={set("subject")} name="subject" />
      </div>

      <div className="mt-5">
        <BilingualField
          label={t("visit.form.message")}
          value={values.message}
          onChange={set("message")}
          name="message"
          multiline
          rows={6}
          required
          error={errors.message}
          defaultLanguage="en"
        />
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="rounded-full bg-[color:var(--color-gold)] px-7 py-3 text-sm font-medium text-[#071a34] transition-transform duration-300 hover:scale-[1.03] disabled:opacity-60"
        >
          {status === "sending" ? t("visit.form.sending") : t("visit.form.submit")}
        </button>
        {status === "sent" ? (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            role="status"
            className="text-sm text-[color:var(--color-gold)]"
          >
            ✓ {t("visit.form.sent")}
          </motion.p>
        ) : null}
      </div>
    </form>
  );
}

const RATINGS = [1, 2, 3, 4, 5];

/** Feedback form — a rating plus a bilingual free-text field. */
export function FeedbackForm() {
  const { t, isOdia } = useLocale();
  const [rating, setRating] = useState(0);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!note.trim() && rating === 0) return;
    setSent(true);
    setNote("");
    setRating(0);
  };

  return (
    <form onSubmit={submit} className="glass shadow-soft rounded-3xl p-6 sm:p-8">
      <h3 className={cn("text-2xl font-light", isOdia && "font-odia")}>{t("visit.feedback.title")}</h3>
      <p className="mt-2 text-sm text-muted">{t("visit.feedback.body")}</p>

      <fieldset className="mt-6">
        <legend className="text-sm font-medium">{t("visit.feedback.rating")}</legend>
        <div className="mt-3 flex gap-2">
          {RATINGS.map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-pressed={rating === value}
              aria-label={`${value} / 5`}
              className={cn(
                "grid h-11 w-11 place-items-center rounded-full text-lg transition-all duration-300",
                rating >= value
                  ? "bg-[color:var(--color-gold)] text-[#071a34]"
                  : "glass text-muted hover:-translate-y-0.5 hover:border-[color:var(--color-gold)]",
              )}
            >
              ★
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-6">
        <BilingualField
          label={t("visit.form.message")}
          value={note}
          onChange={setNote}
          name="feedback"
          multiline
          rows={5}
          defaultLanguage="or"
          placeholder="ଆପଣଙ୍କ ମତାମତ…"
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          className="glass rounded-full px-7 py-3 text-sm font-medium transition-colors hover:border-[color:var(--color-gold)] hover:text-[color:var(--color-gold)]"
        >
          {t("visit.form.submit")}
        </button>
        {sent ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="status" className="text-sm text-[color:var(--color-gold)]">
            ✓ {t("visit.form.sent")}
          </motion.p>
        ) : null}
      </div>
    </form>
  );
}
