// schema.org entities shared by the JSON-LD on several pages.
const SITE = 'https://wielandtech.com';

export const person = {
  '@type': 'Person',
  '@id': 'https://raphaelwieland.com/#person',
  name: 'Raphael Wieland',
  url: 'https://raphaelwieland.com/',
  jobTitle: 'Software and infrastructure engineer',
  sameAs: ['https://raphaelwieland.com/', 'https://github.com/wielandtech', 'https://www.linkedin.com/in/raphael-wieland/'],
};

export const organization = {
  '@type': 'Organization',
  '@id': `${SITE}/#org`,
  name: 'WielandTech',
  legalName: 'VLAN Technology Services, LLC',
  url: `${SITE}/`,
  logo: `${SITE}/favicon.svg`,
  email: 'raphael@wielandtech.com',
  founder: { '@id': person['@id'] },
  sameAs: ['https://github.com/wielandtech-labs'],
};

export const website = {
  '@type': 'WebSite',
  '@id': `${SITE}/#website`,
  url: `${SITE}/`,
  name: 'WielandTech',
  publisher: { '@id': organization['@id'] },
};

export function graph(...nodes: Record<string, unknown>[]) {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE}${item.path}`,
    })),
  };
}
