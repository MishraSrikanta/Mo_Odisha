import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { CultureGrid } from "@/components/sections/CultureGrid";
import { ArtsGallery } from "@/components/sections/ArtsGallery";
import { Container, Divider, Section } from "@/components/ui/Section";
import { TranslatedHeading } from "@/components/ui/TranslatedHeading";

export const metadata: Metadata = {
  title: "Culture",
  description:
    "Odissi and Chhau, Odissi music, Pattachitra, Pipili appliqué, Cuttack filigree, Sambalpuri ikat, the Odia language and living folk traditions.",
  alternates: { canonical: "/culture" },
};

export default function CulturePage() {
  return (
    <>
      <PageHero
        eyebrow="section.culture.eyebrow"
        title="section.culture.title"
        body="section.culture.body"
        odiaTitle="ସଂସ୍କୃତି"
      />

      <Section tight>
        <Container>
          <CultureGrid />
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <TranslatedHeading eyebrow="section.arts.eyebrow" title="section.arts.title" body="section.arts.body" />
          <ArtsGallery />
        </Container>
      </Section>
    </>
  );
}
