import site from '../data/site.json';

export type NavItem = {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
};

export type SiteConfig = typeof site & {
  nav: NavItem[];
};

export function getSite(): SiteConfig {
  return site as SiteConfig;
}

export function waLink(message?: string): string {
  const text = encodeURIComponent(message ?? site.whatsappMessage);
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function mailtoLink(): string {
  return `mailto:${site.email}`;
}
