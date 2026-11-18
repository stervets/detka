export type Card = { title: string; text: string; href?: string; label?: string; image?: string; imageAlt?: string; paragraphs?: { title: string; text: string }[] };
export type Page = {
 path: string; title: string; description: string; eyebrow: string; heading: string; lead: string;
 kind?: 'home' | 'contacts' | 'gallery' | 'article' | 'privacy';
 sections: { title: string; text?: string; cards?: Card[]; image?: string; imageAlt?: string }[];
};
export type SiteContent = { pages: Page[]; settings: { name: string; address: string; phone: string | null; hours: string | null } };
