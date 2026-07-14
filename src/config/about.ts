// ============================================================
//  About page content — single source of truth (DRY).
//  Copy + imagery for the About story page. Images imported as
//  modules → build-time validated, fingerprinted, and carried
//  with this config (no /public string paths to hand-fix).
// ============================================================
import type { ImageMetadata } from 'astro';

import heroBg from '~/assets/about/hero-bg.png';
import storyImg from '~/assets/about/story.png';
import team01 from '~/assets/about/team-01.png';
import team02 from '~/assets/about/team-02.png';
import team03 from '~/assets/about/team-03.png';

export interface AboutValue {
  no: string;
  title: string;
  tag: string;
  body: string;
}

export interface AboutMilestone {
  year: string;
  tag: string;
  title: string;
  body: string;
}

export interface AboutTeamMember {
  img: ImageMetadata;
  num: string;
  reverse: boolean;
  role: string;
  name: string;
  school: string;
  bio: string;
  pull: string;
  tags: string[];
}

export interface AboutConnectCard {
  label: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  icon: 'heart' | 'people' | 'press' | 'pen';
}

export const ABOUT_MEDIA = {
  heroBg,
  storyImg,
} as const;

export const ABOUT_VALUES: AboutValue[] = [
  { no: '01', title: 'Intentional Craft', tag: 'Design & Making', body: 'Every garment begins with a question: does this need to exist? If yes — we make it slowly, with materials chosen for longevity over trend. Craft is not an aesthetic. It is a commitment.' },
  { no: '02', title: 'Expressive Restraint', tag: 'Aesthetic Direction', body: 'We say more with less. Our collections are edited ruthlessly — a process that results in pieces that carry weight, presence, and meaning. Restraint is not minimalism. It is confidence.' },
  { no: '03', title: 'Worn, Not Displayed', tag: 'Human & World', body: 'Fashion exists in motion — on bodies, in streets, in the world. We design for the life you actually live, in silhouettes that move and fabrics that improve with time. Clothing should be used, loved, and kept.' },
];

export const ABOUT_TIMELINE: AboutMilestone[] = [
  { year: '2014', tag: 'Origin', title: 'Founded in East London', body: 'Isabelle Fontaine launches Édition from a Hackney studio with a debut collection of 12 pieces. Sell-out in three weeks.' },
  { year: '2016', tag: 'Expansion', title: 'First flagship store opens', body: 'Our Mayfair flagship opens its doors, designed as a living editorial space — part retail, part gallery.' },
  { year: '2018', tag: 'Recognition', title: 'British Fashion Council Award', body: 'Named Emerging Brand of the Year. Vogue UK features Édition in their annual Best British Brands issue.' },
  { year: '2020', tag: 'Craft', title: 'Paris atelier established', body: 'We open our Paris atelier in Le Marais, enabling hand-finishing on every tailored piece.' },
  { year: '2022', tag: 'Sustainability', title: 'Certified carbon neutral', body: 'Full supply chain transparency achieved. 100% of fabrics sourced from certified ethical mills in Italy, Portugal, and Japan.' },
  { year: '2024', tag: 'Present', title: 'A decade of Édition', body: 'Ten years. Six flagship stores. Forty-two seasonal collections. One unwavering belief: fashion is a form of expression.' },
];

export const ABOUT_TEAM: AboutTeamMember[] = [
  {
    img: team01, num: 'Profile 01 / 03', reverse: false,
    role: 'Founder & Creative Director', name: 'Isabelle Fontaine', school: 'Central Saint Martins · London, UK',
    bio: 'Previously head of design at Céline, Isabelle founded Édition in 2014 with a singular conviction — that fashion is a language, not a product. Her collections have been featured in Vogue Paris, i-D, and Harper’s Bazaar. Named BFC Emerging Talent of the Year in 2018.',
    pull: 'Fashion should feel like something you discovered — not something you were sold.',
    tags: ['Central Saint Martins', 'Former: Céline', 'BFC Award 2018', 'Founded Édition 2014'],
  },
  {
    img: team02, num: 'Profile 02 / 03', reverse: true,
    role: 'Head of Materials & Sustainability', name: 'James Alderton', school: 'Textile Engineering · Joined 2019',
    bio: 'A textile engineer and supply chain specialist, James has spent 15 years building responsible sourcing programmes across Europe, Portugal, and Japan. At Édition he leads our full materials strategy — from fibre selection to end-of-life care — ensuring every piece is made to last.',
    pull: 'The most sustainable garment is the one you never want to throw away.',
    tags: ['Textile Engineering', 'Supply Chain Ethics', 'EU & Japan Mills'],
  },
  {
    img: team03, num: 'Profile 03 / 03', reverse: false,
    role: 'Senior Designer — Womenswear', name: 'Nadia Osei', school: 'Royal College of Art · Joined 2021',
    bio: 'An RCA graduate renowned for her mastery of draped construction, Nadia defines Édition’s womenswear visual language season by season. Her silhouettes — precise yet fluid — are built on a deep understanding of how fabric behaves on a real body in real life.',
    pull: 'Every collection is a conversation between the archive and the next century.',
    tags: ['Royal College of Art', 'Drape & Construction', 'Womenswear'],
  },
];

export const ABOUT_CONNECT: AboutConnectCard[] = [
  { label: 'For Customers', title: 'Book a Styling Session', body: 'Our personal stylists offer complimentary 45-minute consultations — in store or virtually. Get curated recommendations for your wardrobe, occasion, or budget.', cta: 'Book Now', href: '/contact', icon: 'heart' },
  { label: 'For Creatives', title: 'Collaborate with Us', body: 'We work with photographers, stylists, artists, and independent retailers who share our values. If you have a creative project, partnership idea, or stockist enquiry, we’d love to hear it.', cta: 'Start a Conversation', href: '/contact', icon: 'people' },
  { label: 'For Press & Media', title: 'Press & Media Enquiries', body: 'Journalists, editors, and content creators — download our brand assets, request samples, or speak directly with our press team. We respond to all media enquiries within 24 hours.', cta: 'Contact Press Office', href: '/contact', icon: 'press' },
  { label: 'For Talent', title: 'Join the Team', body: 'We’re always looking for exceptional people — designers, technologists, stylists, and storytellers. Browse our open roles or send us a speculative application. Every CV is read by a real person.', cta: 'See Open Roles', href: '/contact', icon: 'pen' },
];
