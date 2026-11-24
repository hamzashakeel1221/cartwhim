import { getCategory, productSku, type Category, type Product } from "./catalog";
import { store } from "./store-config";

export const siteUrl = `https://${store.domain}`;
export const abs = (path: string) => new URL(path, siteUrl).toString();

export function organizationLd() {
  return {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    "@id": abs("/#org"),
    name: store.name,
    url: siteUrl,
    logo: abs("/icon.svg"),
    slogan: store.tagline,
    areaServed: { "@type": "Country", name: "Pakistan" },
    currenciesAccepted: "PKR",
    paymentAccepted: "Cash on Delivery",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+" + store.whatsappNumber,
      email: store.supportEmail,
      contactType: "customer support",
      areaServed: "PK",
      availableLanguage: ["en", "ur"],
    },
    hasMerchantReturnPolicy: returnPolicyLd(),
  };
}

export function websiteLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": abs("/#website"),
    name: store.name,
    url: siteUrl,
    inLanguage: "en-PK",
    publisher: { "@id": abs("/#org") },
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: abs("/products?q={search_term_string}") },
      "query-input": "required name=search_term_string",
    },
  };
}

function returnPolicyLd() {
  return {
    "@type": "MerchantReturnPolicy",
    applicableCountry: "PK",
    returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
    merchantReturnDays: store.returnDays,
    returnMethod: "https://schema.org/ReturnByMail",
    returnFees: "https://schema.org/FreeReturn",
  };
}

export function productLd(p: Product) {
  const validUntil = new Date();
  validUntil.setMonth(validUntil.getMonth() + 3);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": abs(`/products/${p.slug}#product`),
    name: p.name,
    description: p.description,
    sku: productSku(p),
    image: p.images?.length ? p.images.map(abs) : [abs(`/products/${p.slug}/opengraph-image`)],
    category: getCategory(p.category)?.name,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviews, bestRating: 5 },
    offers: {
      "@type": "Offer",
      url: abs(`/products/${p.slug}`),
      priceCurrency: "PKR",
      price: p.price,
      priceValidUntil: validUntil.toISOString().slice(0, 10),
      availability: p.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
      seller: { "@id": abs("/#org") },
      acceptedPaymentMethod: "https://schema.org/COD",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: { "@type": "DefinedRegion", addressCountry: "PK" },
        shippingRate: { "@type": "MonetaryAmount", currency: "PKR", value: p.price >= store.shipping.freeOver ? 0 : store.shipping.flatFee },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 0, maxValue: 1, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 2, maxValue: 5, unitCode: "DAY" },
        },
      },
      hasMerchantReturnPolicy: returnPolicyLd(),
    },
  };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function itemListLd(c: Category, list: Product[]) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: c.name,
    description: c.intro,
    url: abs(`/category/${c.slug}`),
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: list.length,
      itemListElement: list.map((p, i) => ({ "@type": "ListItem", position: i + 1, url: abs(`/products/${p.slug}`), name: p.name })),
    },
  };
}

export function faqLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
