// Single source of truth. Questionnaire first, old site fills gaps.
export const site = {
  name: 'A.R. Pagán Auction Group',
  legalName: 'A.R. Pagán Auction Group',
  founded: 1977,
  url: 'https://arpagan.com',
  tagline: 'Auctions · Appraisals · Asset Liquidations',

  contact: {
    email: 'info@arpagan.com',
    phonePR: '787-780-6464',
    phoneSF: '415-566-6464',
    hours: '9:00 AM – 6:00 PM',
    poBox: 'P.O. Box 1736', // confirmed by Luzette
    poCity: 'Bayamón, PR 00960',
    sfPoBox: 'P.O. Box 225309',
    sfPoCity: 'San Francisco, CA 94122',
    whatsapp: 'https://wa.me/17877806464',
    hoursDays: 'Monday – Friday',
  },

  social: {
    facebook: 'https://facebook.com/arpaganauctiongroup',
    instagram: 'https://instagram.com/arpagan_auctions',
  },

  // One site-wide landing page on BidSpotter, used by every auction's bid button.
  bidspotter: 'https://www.bidspotter.com/en-us/auction-catalogues/caribbeanasset',
  buyersPremium: 'A buyer\'s premium will be charged.', // fluctuates; no fixed % on the site

  stats: {
    years: new Date().getFullYear() - 1977,
    sales: 4000,
    states: 40,
    countries: 9,
  },

  forms: {
    formspree: import.meta.env.PUBLIC_FORMSPREE_ID ?? '',
    constantContact: import.meta.env.PUBLIC_CC_SIGNUP_URL || 'https://lp.constantcontactpages.com/sl/HM4Qb9D/signup',
    stripe: import.meta.env.PUBLIC_STRIPE_PAY_URL ?? '',
  },
} as const;

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/services', label: 'Services' },
  { href: '/auctions', label: 'Auctions' },
  { href: '/consign', label: 'Consign' },
  { href: '/past', label: 'Past Auctions' },
  { href: '/contact', label: 'Contact' },
] as const;

export const countries = [
  'Puerto Rico', 'United States', 'U.S. Virgin Islands', 'Canada', 'Mexico', 'Jamaica',
  'Panama', 'Costa Rica', 'El Salvador', 'Brazil', 'Uruguay', 'Bolivia',
];
