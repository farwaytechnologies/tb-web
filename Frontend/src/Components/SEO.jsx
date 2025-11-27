import { Helmet } from '@dr.pogodin/react-helmet';

export default function SEO({
  title,
  description,
  image = "https://yoursite.com/og-default.jpg",  // ← change to your real default image
  url = window.location.href,                    // auto uses current URL
  type = "website"
}) {
  const siteName = "Your Site Name";  // ← change once here
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* This line = magic for social media previews */}
      <meta name="fragment" content="!" />
    </Helmet>
  );
}