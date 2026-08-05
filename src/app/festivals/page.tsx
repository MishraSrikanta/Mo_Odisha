import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FestivalCalendar } from "@/components/sections/FestivalCalendar";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Festivals",
  description:
    "Rath Yatra, Bali Yatra, Nuakhai, Raja Parba, Boita Bandana, Cuttack Durga Puja, Dhanu Yatra and the Konark Dance Festival — an interactive calendar.",
  alternates: { canonical: "/festivals" },
};

export default function FestivalsPage() {
  return (
    <>
      <PageHero
        eyebrow="section.festivals.eyebrow"
        title="section.festivals.title"
        body="section.festivals.body"
        odiaTitle="ପର୍ବପର୍ବାଣି"
      />
      <Section tight>
        <Container>
          <FestivalCalendar />
        </Container>
      </Section>
    </>
  );
}
