import Link from "next/link";
import { Container } from "@/components/ui/Section";
import { LetterField } from "@/components/hero/LetterField";

export default function NotFound() {
  return (
    <section className="relative isolate grid min-h-[70svh] place-items-center overflow-hidden py-32">
      <LetterField className="absolute inset-0 h-full w-full opacity-60" density={0.6} />
      <Container className="relative text-center">
        <p className="font-odia text-[clamp(4rem,14vw,10rem)] leading-none">
          <span className="gold-text">୪୦୪</span>
        </p>
        <h1 className="mt-4 text-3xl font-light sm:text-4xl">This path leads nowhere</h1>
        <p className="mx-auto mt-4 max-w-md text-muted">
          The page you were looking for is not here. The rest of Odisha still is.
        </p>
        <Link
          href="/"
          className="mt-9 inline-block rounded-full bg-[color:var(--color-gold)] px-7 py-3 text-sm font-medium text-[#071a34] transition-transform duration-300 hover:scale-105"
        >
          Return home
        </Link>
      </Container>
    </section>
  );
}
