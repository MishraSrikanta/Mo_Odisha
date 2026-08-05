import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { HistoryTimeline } from "@/components/sections/HistoryTimeline";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "History",
  description:
    "Ancient Kalinga, the Ashokan war, Kharavela, the maritime centuries, the Eastern Ganga and Gajapati dynasties, the British period and modern Odisha.",
  alternates: { canonical: "/history" },
};

export default function HistoryPage() {
  return (
    <>
      <PageHero
        eyebrow="section.history.eyebrow"
        title="section.history.title"
        body="section.history.body"
        odiaTitle="ଇତିହାସ"
      />
      <Section tight>
        <Container>
          <HistoryTimeline />
        </Container>
      </Section>
    </>
  );
}
