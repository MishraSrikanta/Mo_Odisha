import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OdishaMap } from "@/components/map/OdishaMap";
import { DistrictExplorer } from "@/components/map/DistrictExplorer";
import { Container, Divider, Section } from "@/components/ui/Section";
import { TranslatedHeading } from "@/components/ui/TranslatedHeading";

export const metadata: Metadata = {
  title: "Districts",
  description:
    "All 30 districts of Odisha — headquarters, population, what each is known for, its attractions, food, festival and famous personalities.",
  alternates: { canonical: "/districts" },
};

export default function DistrictsPage() {
  return (
    <>
      <PageHero
        eyebrow="section.map.eyebrow"
        title="section.map.title"
        body="section.map.body"
        odiaTitle="ଜିଲ୍ଲା"
      />

      <Section tight>
        <Container>
          <OdishaMap />
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <TranslatedHeading eyebrow="nav.districts" title="section.map.title" body="map.hint" />
          <div className="mt-12">
            <DistrictExplorer />
          </div>
        </Container>
      </Section>
    </>
  );
}
