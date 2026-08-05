import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { TempleGallery } from "@/components/sections/TempleGallery";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Temples",
  description:
    "Jagannath at Puri, the Konark Sun Temple, Lingaraj, Mukteswar, Rajarani, Brahmeswar, Parasurameswar and the Chausathi Jogini shrine at Hirapur.",
  alternates: { canonical: "/temples" },
};

export default function TemplesPage() {
  return (
    <>
      <PageHero
        eyebrow="section.temples.eyebrow"
        title="section.temples.title"
        body="section.temples.body"
        odiaTitle="ମନ୍ଦିର"
      />
      <Section tight>
        <Container>
          <TempleGallery />
        </Container>
      </Section>
    </>
  );
}
