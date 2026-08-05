import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { FoodSection } from "@/components/sections/FoodSection";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Food",
  description:
    "Pakhala, dalma, santula, macha besara, chungdi malai, chhena poda, rasagola, khaja and the mahaprasad of the Puri temple kitchen.",
  alternates: { canonical: "/food" },
};

export default function FoodPage() {
  return (
    <>
      <PageHero eyebrow="section.food.eyebrow" title="section.food.title" body="section.food.body" odiaTitle="ଖାଦ୍ୟ" />
      <Section tight>
        <Container>
          <FoodSection />
        </Container>
      </Section>
    </>
  );
}
