import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm, FeedbackForm } from "@/components/visit/VisitForms";
import { ContactDetails, Faq, MapEmbed, VideoPanel } from "@/components/visit/VisitPanels";
import { Container, Divider, Section } from "@/components/ui/Section";
import { TranslatedHeading } from "@/components/ui/TranslatedHeading";
import { CONTACT, SITE } from "@/lib/data/site";

export const metadata: Metadata = {
  title: "Visit Us",
  description:
    "Write to us, find the office, watch the film, and leave feedback in Odia or English with a built-in virtual Odia keyboard.",
  alternates: { canonical: "/visit-us" },
};

/** Local business structured data for the contact page. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "TouristInformationCenter",
  name: CONTACT.organisation,
  url: `${SITE.url}/visit-us`,
  email: CONTACT.email,
  telephone: CONTACT.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: CONTACT.address[0],
    addressLocality: "Bhubaneswar",
    addressRegion: "Odisha",
    postalCode: "751001",
    addressCountry: "IN",
  },
  geo: { "@type": "GeoCoordinates", latitude: CONTACT.coords[0], longitude: CONTACT.coords[1] },
  openingHours: ["Mo-Fr 09:30-18:00", "Sa 10:00-16:00"],
};

export default function VisitPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <PageHero eyebrow="visit.eyebrow" title="visit.title" body="visit.body" odiaTitle="ଆମକୁ ଭେଟନ୍ତୁ" />

      <Section tight>
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr] lg:items-start">
            <ContactForm />
            <ContactDetails />
          </div>
        </Container>
      </Section>

      <Section tight>
        <Container>
          <div className="grid gap-6 lg:grid-cols-2">
            <MapEmbed />
            <VideoPanel />
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start lg:gap-16">
            <div>
              <TranslatedHeading eyebrow="visit.eyebrow" title="visit.feedback.title" body="visit.feedback.body" />
            </div>
            <FeedbackForm />
          </div>
        </Container>
      </Section>

      <Divider />

      <Section>
        <Container>
          <TranslatedHeading eyebrow="visit.eyebrow" title="visit.faq.title" />
          <Faq />
        </Container>
      </Section>
    </>
  );
}
