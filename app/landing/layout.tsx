import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Immagrate Canada | Confident Immigration Planning",
  description:
    "Immagrate prepares you for Canada—language lift, job-search runway, and documented next steps tailored to your profile.",
  openGraph: {
    title: "Immagrate Canada | Confident Immigration Planning",
    description:
      "Preparation services for Canada: language coaching, job-search readiness, and stepwise plans while you pick the right pathway.",
    url: "https://immagrate.ca",
    siteName: "Immagrate",
  },
};

export default function LandingLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}
