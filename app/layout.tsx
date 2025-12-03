import './globals.css';
import keywordsData from '@/public/seo/keywords.json';

export const metadata = {
  title: "INDEP 2025 - Cultural Extravaganza | Developed by JWS Technologies",
  description:
    "INDEP 2025 is the premier Inter-Departmental Cultural Festival. Website developed by JWS Technologies.",
  keywords: keywordsData.keywords.join(', '),
  creator: "JWS Technologies",
  metadataBase: new URL("https://indep.jwstechnologies.com"),

  openGraph: {
    title: "INDEP 2025 - Cultural Extravaganza",
    description:
      "Official website of INDEP 2025 developed by JWS Technologies. Explore events, teams, schedules & registrations.",
    url: "https://indep.jwstechnologies.com",
    siteName: "INDEP 2025",
    publisher: "JWS Technologies",
    images: [
      {
        url: "/banner.jpg",
        width: 1200,
        height: 630,
        alt: "INDEP 2025 Banner",
      },
    ],
    locale: "en_IN",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "INDEP 2025 | Developed by JWS Technologies",
    description:
      "INDEP 2025 cultural festival website created by JWS Technologies — Explore events & more.",
    creator: "@JWSTechnologies",
    images: ["/banner.jpg"],
  },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Festival",
    "name": "INDEP 2025 - Inter-Departmental Cultural Festival",
    "url": "https://indep.jwstechnologies.com",
    "startDate": "2025-12-12",
    "endDate": "2025-12-13",
    "location": {
      "@type": "Place",
      "name": "St. Joseph's College",
      "address": "Tiruchirappalli, Tamil Nadu, India"
    },
    "creator": {
      "@type": "Organization",
      "name": "JWS Technologies",
      "url": "https://jwstechnologies.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "JWS Technologies"
    },
    "description": "Official website for INDEP 2025 developed by JWS Technologies.",
    "keywords": keywordsData.keywords,
    "sameAs": [
      "https://jwstechnologies.com",
      "https://instagram.com/jws_technologies",
      "https://linkedin.com/company/jws-technologies"
    ]
  };

  return (
    <html lang="en">
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