import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, type = "website", image, url }) {
  const siteTitle = "TUA Giyim";
  const fullTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const metaDesc = description || "Geleneksel zanaatı modern çizgilerle buluşturan TUA Giyim ile tanışın. Ruhunuza hitap eden zarif tasarımlar.";
  const metaImage = image || "https://tuagiyim.com/images/yeniSezon.png"; 

  return (
    <Helmet>
      {/* Standart Meta Etiketleri */}
      <title>{fullTitle}</title>
      <meta name="description" content={metaDesc} />
      <link rel="canonical" href={metaUrl} />

      {/* Facebook / Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDesc} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:site_name" content={siteTitle} />

      {/* Twitter Kartları */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={metaDesc} />
      <meta name="twitter:image" content={metaImage} />
    </Helmet>
  );
}