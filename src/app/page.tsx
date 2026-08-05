import Link from "next/link";
import { Hero } from "@/components/hero/Hero";
import { GlyphMarquee, Intro } from "@/components/sections/Intro";
import { TourismSection } from "@/components/sections/TourismSection";
import { HistoryTimeline } from "@/components/sections/HistoryTimeline";
import { CultureGrid } from "@/components/sections/CultureGrid";
import { TempleGallery } from "@/components/sections/TempleGallery";
import { WildlifeSection } from "@/components/sections/WildlifeSection";
import { FoodSection } from "@/components/sections/FoodSection";
import { FestivalCalendar } from "@/components/sections/FestivalCalendar";
import { ArtsGallery } from "@/components/sections/ArtsGallery";
import { OdishaMap } from "@/components/map/OdishaMap";
import { Container, Divider, Section } from "@/components/ui/Section";
import { TranslatedHeading } from "@/components/ui/TranslatedHeading";

/** "See the rest" link shown under each condensed home section. */
function More({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="group mt-12 inline-flex items-center gap-3 text-sm text-[color:var(--color-gold)]">
      {label}
      <span className="h-px w-8 bg-[color:var(--color-gold)] transition-all duration-500 group-hover:w-14" />
    </Link>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />

      <Section id="intro">
        <Intro />
      </Section>

      <GlyphMarquee />

      <Section id="tourism">
        <Container>
          <TranslatedHeading eyebrow="section.tourism.eyebrow" title="section.tourism.title" body="section.tourism.body" />
          <div className="mt-12">
            <TourismSection limit={8} />
          </div>
          <More href="/tourism" label="All destinations" />
        </Container>
      </Section>

      <Divider />

      <Section id="history">
        <Container>
          <TranslatedHeading eyebrow="section.history.eyebrow" title="section.history.title" body="section.history.body" />
          <HistoryTimeline limit={5} />
          <More href="/history" label="The full timeline" />
        </Container>
      </Section>

      <Divider />

      <Section id="culture">
        <Container>
          <TranslatedHeading eyebrow="section.culture.eyebrow" title="section.culture.title" body="section.culture.body" />
          <div className="mt-12">
            <CultureGrid limit={6} />
          </div>
          <More href="/culture" label="Explore culture" />
        </Container>
      </Section>

      <Divider />

      <Section id="temples">
        <Container>
          <TranslatedHeading eyebrow="section.temples.eyebrow" title="section.temples.title" body="section.temples.body" />
          <div className="mt-12">
            <TempleGallery limit={3} />
          </div>
          <More href="/temples" label="All temples" />
        </Container>
      </Section>

      <Divider />

      <Section id="wildlife">
        <Container>
          <TranslatedHeading eyebrow="section.wildlife.eyebrow" title="section.wildlife.title" body="section.wildlife.body" />
          <WildlifeSection limit={3} />
          <More href="/wildlife" label="All parks and sanctuaries" />
        </Container>
      </Section>

      <Divider />

      <Section id="food">
        <Container>
          <TranslatedHeading eyebrow="section.food.eyebrow" title="section.food.title" body="section.food.body" />
          <div className="mt-12">
            <FoodSection limit={8} />
          </div>
          <More href="/food" label="The whole table" />
        </Container>
      </Section>

      <Divider />

      <Section id="festivals">
        <Container>
          <TranslatedHeading eyebrow="section.festivals.eyebrow" title="section.festivals.title" body="section.festivals.body" />
          <div className="mt-12">
            <FestivalCalendar limit={6} />
          </div>
          <More href="/festivals" label="The full calendar" />
        </Container>
      </Section>

      <Divider />

      <Section id="arts">
        <Container>
          <TranslatedHeading eyebrow="section.arts.eyebrow" title="section.arts.title" body="section.arts.body" />
          <ArtsGallery limit={6} />
          <More href="/gallery" label="Open the gallery" />
        </Container>
      </Section>

      <Divider />

      <Section id="map">
        <Container>
          <TranslatedHeading eyebrow="section.map.eyebrow" title="section.map.title" body="section.map.body" />
          <div className="mt-12">
            <OdishaMap />
          </div>
          <More href="/districts" label="Search all 30 districts" />
        </Container>
      </Section>
    </>
  );
}
