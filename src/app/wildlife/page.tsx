import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { WildlifeSection } from "@/components/sections/WildlifeSection";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Wildlife",
  description:
    "Similipal's black tigers, Bhitarkanika's saltwater crocodiles, the Satkosia gorge, Nalabana's million winter birds and the Gahirmatha turtle rookery.",
  alternates: { canonical: "/wildlife" },
};

export default function WildlifePage() {
  return (
    <>
      <PageHero
        eyebrow="section.wildlife.eyebrow"
        title="section.wildlife.title"
        body="section.wildlife.body"
        odiaTitle="ବନ୍ୟଜନ୍ତୁ"
      />
      <Section tight>
        <Container>
          <WildlifeSection />
        </Container>
      </Section>
    </>
  );
}
