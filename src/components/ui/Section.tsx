import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[1400px] px-5 sm:px-8 lg:px-12 2xl:max-w-[1600px]", className)}>{children}</div>;
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <header className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <Reveal variant="fade">
          <p className="flex items-center gap-3 text-xs font-medium tracking-[0.32em] text-[color:var(--color-gold)] uppercase">
            {align === "center" ? null : <span className="h-px w-8 bg-[color:var(--color-gold)]" />}
            {eyebrow}
          </p>
        </Reveal>
      ) : null}
      <Reveal variant="blur" delay={0.06}>
        <h2 className="mt-4 text-[clamp(1.9rem,4.4vw,3.6rem)] leading-[1.06] font-light">{title}</h2>
      </Reveal>
      {body ? (
        <Reveal variant="up" delay={0.14}>
          <p className="mt-5 text-base leading-relaxed text-muted sm:text-lg">{body}</p>
        </Reveal>
      ) : null}
    </header>
  );
}

export function Section({
  id,
  children,
  className,
  tight = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tight?: boolean;
}) {
  return (
    <section id={id} className={cn("relative", tight ? "py-16 sm:py-20" : "py-24 sm:py-32 lg:py-40", className)}>
      {children}
    </section>
  );
}

/** Thin gold rule used between major sections. */
export function Divider({ className }: { className?: string }) {
  return <div className={cn("rule-gold h-px w-full opacity-40", className)} aria-hidden="true" />;
}
