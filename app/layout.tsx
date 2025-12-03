import './globals.css';
import { Metadata } from 'next';
// import keywordsData from '@/public/seo/keywords.json';

// Define the Base URL once to avoid repetition
const BASE_URL = "https://indep.jwstechnologies.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "INDEP 2025 - St. Joseph's College Cultural Festival | Trichy",
    template: "%s | INDEP 2025"
  },
  description: "Official website for INDEP 2025, the inter-departmental cultural extravaganza of St. Joseph's College, Trichy. Register for events, view schedules, and check results.",

  // Google largely ignores this, but it doesn't hurt to keep top 10 relevant ones
  keywords: [
    "INDEP 2025", "St. Joseph's College Trichy", "INDEP Cultural Fest",
    "SJC Trichy Culturals", "College Fest Trichy", "INDEP Registration",
    "INDEP Results", "JWS Technologies"
  ],

  authors: [{ name: "JWS Technologies", url: "https://jwstechnologies.com" }],
  creator: "JWS Technologies",
  publisher: "St. Joseph's College",

  // CRITICAL for SEO: Prevents duplicate content issues
  alternates: {
    canonical: "/",
  },

  // Tells Google to index this site
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  openGraph: {
    title: "INDEP 2025 - The Cultural Extravaganza",
    description: "Join the celebration at St. Joseph's College, Trichy. Official registration and updates for INDEP 2025.",
    url: BASE_URL,
    siteName: "INDEP 2025",
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/seo/indep-banner-og.jpg", // Make sure this image exists in public/seo/
        width: 1200,
        height: 630,
        alt: "INDEP 2025 Cultural Festival Banner",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "INDEP 2025 | SJC Trichy",
    description: "The biggest cultural fest of Trichy is back. Register now for INDEP 2025.",
    creator: "@JWSTechnologies", // Replace if INDEP has its own handle
    images: ["/seo/indep-banner-og.jpg"],
  },

  // Verification for Search Console (You need to get this code from GSC)
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Enhanced Schema.org data for "Event" Rich Snippets
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Festival",
    "name": "INDEP 2025",
    "description": "INDEP 2025 is the annual inter-departmental cultural festival of St. Joseph's College, Tiruchirappalli.",
    "url": BASE_URL,
    "startDate": "2025-12-12",
    "endDate": "2025-12-13",
    "eventStatus": "https://schema.org/EventScheduled",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "location": {
      "@type": "Place",
      "name": "St. Joseph's College, Tiruchirappalli",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Chatram Bus Stand",
        "addressLocality": "Tiruchirappalli",
        "addressRegion": "TN",
        "postalCode": "620002",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": "St. Joseph's College Fine Arts Association",
      "url": "https://sjctni.edu"
    },
    "offers": {
      "@type": "Offer",
      "url": `${BASE_URL}/register`,
      "price": "0",
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "validFrom": "2025-11-01"
    }
  };

  return (
    <html lang="en">
      <meta name="google-site-verification" content="VLLptwMTb5cikCZxmctn32jGyX6rS9FK6MNKn3KZZRQ" />
      <body className="bg-linear-to-br from-gray-50 to-blue-50 min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}