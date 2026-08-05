import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { TourismSection } from "@/components/sections/TourismSection";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Tourism",
  description:
    "Beaches, temples, waterfalls, forests, wildlife, lakes, heritage sites, eco tourism, hill stations, museums, adventure, tribal villages and pilgrimage across Odisha.",
  alternates: { canonical: "/tourism" },
};

export default function TourismPage() {
  return (
    <>
      <PageHero
        eyebrow="section.tourism.eyebrow"
        title="section.tourism.title"
        body="section.tourism.body"
        odiaTitle="ପର୍ଯ୍ୟଟନ"
      />
      <Section tight>
        <Container>
          <TourismSection />
        </Container>
      </Section>
    </>
  );
}
