export interface BreadcrumbItem {
  name: string
  url: string
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.name,
            item: `https://multisheets.com${item.url}`,
          })),
        }),
      }}
    />
  )
}

export function ArticleJsonLd({
  title,
  description,
  url,
  datePublished,
  dateModified,
}: {
  title: string
  description: string
  url: string
  datePublished: string
  dateModified?: string
}) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: title,
          description,
          url: `https://multisheets.com${url}`,
          datePublished,
          dateModified: dateModified || datePublished,
          author: {
            '@type': 'Organization',
            name: 'Multisheets',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Multisheets',
            logo: {
              '@type': 'ImageObject',
              url: 'https://multisheets.com/icon-512.svg',
            },
          },
        }),
      }}
    />
  )
}
