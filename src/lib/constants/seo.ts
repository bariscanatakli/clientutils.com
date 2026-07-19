// SEO Constants for clientutils.com

export const SITE_CONFIG = {
  name: "ClientUtils",
  domain: "clientutils.com",
  url: "https://clientutils.com",
  description:
    "Free, open-source developer tools that run entirely in your browser. No data sent to servers. JSON Formatter, UUID Generator, JWT Decoder, Regex Tester, and more.",
  locale: "en",
  twitterHandle: "@clientutils",
  githubUrl: "https://github.com/clientutils",
} as const;

export function buildPageMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  const fullTitle = `${title} | ${SITE_CONFIG.name}`;
  const url = `${SITE_CONFIG.url}${path}`;

  return {
    title: fullTitle,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_CONFIG.name,
      type: "website" as const,
      locale: SITE_CONFIG.locale,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      site: SITE_CONFIG.twitterHandle,
    },
  };
}
