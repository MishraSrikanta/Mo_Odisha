import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container, Divider, Section } from "@/components/ui/Section";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import { Motif } from "@/components/ui/Motif";
import { GlyphMarquee } from "@/components/sections/Intro";

export const metadata: Metadata = {
  title: "About Odisha",
  description:
    "Geography, language, state symbols, people and the shape of Odisha — a factual introduction to the land behind the temples and the tides.",
  alternates: { canonical: "/about" },
};

const FACTS = [
  { label: "Formed", value: "1 April 1936", note: "India's first province defined by language" },
  { label: "Capital", value: "Bhubaneswar", note: "The temple city, planned in 1948" },
  { label: "Largest city", value: "Bhubaneswar", note: "Cuttack remains the commercial heart" },
  { label: "Area", value: "155,707 km²", note: "8th largest state in India" },
  { label: "Population", value: "≈ 4.2 crore", note: "2011 Census; 30 districts" },
  { label: "Coastline", value: "≈ 480 km", note: "Along the Bay of Bengal" },
  { label: "Official language", value: "Odia (ଓଡ଼ିଆ)", note: "Classical language of India, 2014" },
  { label: "Forest cover", value: "≈ 33% of area", note: "Among the highest in India" },
];

const SYMBOLS = [
  { label: "State animal", value: "Sambar deer", odia: "ସାମ୍ବର", motif: "forest" as const },
  { label: "State bird", value: "Indian roller", odia: "ନୀଳକଣ୍ଠ", motif: "wave" as const },
  { label: "State tree", value: "Sacred fig (Aswatha)", odia: "ଅଶ୍ୱତ୍ଥ", motif: "lotus" as const },
  { label: "State flower", value: "Ashoka", odia: "ଅଶୋକ", motif: "flame" as const },
];

const GEOGRAPHY = [
  {
    title: "The coastal plain",
    body: "A wide alluvial belt built by the Mahanadi, Brahmani, Baitarani, Subarnarekha and Rushikulya. It carries most of the state's population, its rice, its ports and its mangroves — and it takes the brunt of the cyclone season.",
    motif: "wave" as const,
  },
  {
    title: "The Eastern Ghats",
    body: "A broken chain of hills running south-west, rising to 1,672 m at Deomali. Coffee, pepper and turmeric grow on the slopes, and most of the state's particularly vulnerable tribal groups live in these highlands.",
    motif: "forest" as const,
  },
  {
    title: "The central tableland",
    body: "Rolling plateau country between the hills and the coast, drained by the upper Mahanadi. Sal forest, iron and coal, and the reservoir behind the Hirakud dam define it.",
    motif: "loom" as const,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="nav.about" title="home.intro.title" body="home.intro.body" odiaTitle="ଓଡ଼ିଶା" />

      <Section tight>
        <Container>
          <RevealGroup className="grid gap-px overflow-hidden rounded-3xl border border-[color:var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {FACTS.map((fact) => (
              <RevealItem key={fact.label} className="glass p-6">
                <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">{fact.label}</p>
                <p className="mt-2 text-xl leading-tight font-light">{fact.value}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted">{fact.note}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>

      <GlyphMarquee />

      <Section>
        <Container>
          <Reveal variant="blur">
            <h2 className="max-w-3xl text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.06] font-light">
              Three landscapes, stacked from the sea inland
            </h2>
          </Reveal>

          <ul className="mt-14 grid gap-6 lg:grid-cols-3">
            {GEOGRAPHY.map((region, index) => (
              <Reveal key={region.title} variant="up" delay={index * 0.08} as="li">
                <article className="glass ornament group shadow-soft relative h-full overflow-hidden rounded-3xl">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Motif
                      id={region.title}
                      kind={region.motif}
                      className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl leading-tight font-light">{region.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{region.body}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
            <div>
              <Reveal variant="fade">
                <p className="flex items-center gap-3 text-xs tracking-[0.32em] text-[color:var(--color-gold)] uppercase">
                  <span className="h-px w-8 bg-[color:var(--color-gold)]" aria-hidden="true" />
                  Language
                </p>
              </Reveal>
              <Reveal variant="blur" delay={0.06}>
                <h2 className="mt-5 text-[clamp(1.9rem,4vw,3.2rem)] leading-[1.06] font-light">
                  A script shaped by the palm leaf
                </h2>
              </Reveal>
              <Reveal variant="up" delay={0.12}>
                <p className="mt-6 text-base leading-relaxed text-muted">
                  Odia is written in a rounded script descended from Kalinga Brahmi. The curves are not decorative — for
                  a thousand years the writing surface was a dried palm leaf incised with an iron stylus, and a straight
                  horizontal stroke would split the leaf along its grain. Every glyph in the curtain on the home page
                  carries that history in its shape.
                </p>
              </Reveal>
              <Reveal variant="up" delay={0.18}>
                <Link href="/culture" className="group mt-7 inline-flex items-center gap-3 text-sm text-[color:var(--color-gold)]">
                  Odia in the culture section
                  <span className="h-px w-8 bg-[color:var(--color-gold)] transition-all duration-500 group-hover:w-14" />
                </Link>
              </Reveal>
            </div>

            <Reveal variant="scale" delay={0.1}>
              <div className="glass shadow-soft rounded-3xl p-8 text-center sm:p-12">
                <p className="font-odia text-[clamp(2rem,5vw,3.4rem)] leading-[1.5]">
                  ଅ ଆ ଇ ଈ ଉ ଊ ଋ
                  <br />
                  କ ଖ ଗ ଘ ଙ
                  <br />
                  ଚ ଛ ଜ ଝ ଞ
                  <br />
                  ଟ ଠ ଡ ଢ ଣ
                  <br />
                  ତ ଥ ଦ ଧ ନ
                  <br />
                  ପ ଫ ବ ଭ ମ
                  <br />
                  ଯ ର ଲ ୱ ଶ ଷ ସ ହ
                </p>
                <p className="mt-8 text-xs tracking-[0.24em] text-muted uppercase">The varnamala</p>
              </div>
            </Reveal>
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <Reveal variant="blur">
            <h2 className="text-[clamp(1.9rem,4.2vw,3.4rem)] leading-[1.06] font-light">State symbols</h2>
          </Reveal>
          <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {SYMBOLS.map((symbol) => (
              <RevealItem key={symbol.label}>
                <article className="glass ornament group shadow-soft relative overflow-hidden rounded-3xl">
                  <div className="aspect-square overflow-hidden">
                    <Motif
                      id={symbol.label}
                      kind={symbol.motif}
                      className="h-full w-full transition-transform duration-[1.2s] group-hover:scale-110"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-[0.65rem] tracking-[0.2em] text-muted uppercase">{symbol.label}</p>
                    <p className="mt-1.5 text-lg font-light">{symbol.value}</p>
                    <p className="font-odia mt-0.5 text-base text-[color:var(--color-gold)]">{symbol.odia}</p>
                  </div>
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </Container>
      </Section>
    </>
  );
}
