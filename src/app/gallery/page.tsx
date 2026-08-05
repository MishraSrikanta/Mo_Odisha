import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { GalleryWall } from "@/components/sections/GalleryWall";
import { Container, Section } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "A visual wall of Odisha — temples, coast, forest, craft, festivals and people, drawn from every collection on the site.",
  alternates: { canonical: "/gallery" },
};

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="nav.gallery"
        title="section.arts.title"
        body="section.arts.body"
        odiaTitle="ଚିତ୍ରଶାଳା"
      />
      <Section tight>
        <Container>
          <GalleryWall />
        </Container>
      </Section>
    </>
  );
}
