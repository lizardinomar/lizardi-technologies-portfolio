// Seed content used when Sanity isn't connected yet (and as the build fallback).
// Once PUBLIC_SANITY_PROJECT_ID is set, live content comes from Sanity instead.
import type { Auction } from '../lib/auctions';

export const seedAuctions: Auction[] = [
  {
    id: 'seed-flor-de-harina',
    slug: 'flor-de-harina',
    title: 'Flor de Harina',
    startDate: '2026-11-11T10:00:00-04:00',
    venue: 'Flor de Harina',
    address: '147 Av. Winston Churchill',
    city: 'San Juan, PR',
    description:
      'Complete liquidation of a commercial bakery: production equipment, a Cummins 60KW generator, transfer switch, materials and support assets. 254 lots, live and online.',
    lotCount: 254,
    highlights: ['Commercial bakery production equipment', 'Cummins 60KW generator', 'Transfer switch', 'Materials and support assets'],
  },
];

// Ten most recent sales that had their own pages on the old site (text-only per questionnaire).
export const recentSales = [
  'Flor de Harina Bakery',
  '1930 Culturas',
  'Party City – 3 Stores',
  'El Mesón',
  'Choco Lato',
  "Applebee's Plaza Las Américas",
  'Rincón Criollo',
  'Café La Criolla',
  'Restaurante La Frecuencia',
  'Antigua Central Coloso — Aguada',
];

// Past-auction historical names, grouped as on the current site.
// 108 total — kept text-only per questionnaire (no detail pages for history).
export const pastAuctionsIndex = {
  majorPRIndustrial: [
    "Dunbars Restaurant","Sony of PR","Sun Microsystems","Motorola of PR",
    "Tyco Electronics (Arecibo)","General Instrument","Avetek Electronics",
    "Hershey's","Technimark","Industrias Vassallo","Northrop Grumman",
    "ITW Ransberg","Chevron Phillips Chemical (Guayama)","Avon Jewelry (San Sebastián)",
    "Wolverine Shoes (Aguadilla Shoe Co.)","Olympic Mills (4 Factories)",
    "Stryker Medical (Arroyo)","Witnauer Watch Company","Drake Boat Manufacturing, Inc.",
    "Unilever PR","Maidenform, Inc.","Hill Construction Corp.","Beatriz Ready Mix",
    "Pérez & Cía. Ship Repair","Farmacias El Amal","Inyx Pharmaceuticals",
    "GlaxoSmithKline","West Pharmaceutical (Vega Alta)","Bristol Myers",
    "Bio Vail Pharmaceuticals","Telemundo Foundation Prop.","Insular de Seguros (Hato Rey)",
  ],
  majorPRRetail: [
    "Direct TV","Ferreterías Massó","Tiendas Donato","Sterling House (San Patricio)",
    "Supermercados Pitusa","Pueblo Supermarkets","Pizzeria Uno","Famous Dave's BBQ",
    "Budatai Restaurant","Dunkin' Donuts","McDonald's","Boston Market Restaurants",
    "Fuddruckers","Ruby Tuesday's","TGI Friday's","Outback Steakhouse","Quiznos",
    "Meliá Coco Beach","Caribe Hilton Hotel","The Normandie Hotel","Cerromar Beach Hotel",
    "U.S. Bankruptcy Court — Puerto Rico","Banco de Desarrollo Económico",
    "Banco Popular","FirstBank","Banco R.G.","Bank of Boston (Hato Rey)",
    "Royal Bank","Westernbank","Eurobank","Plaza Acuática (Hato Rey)",
  ],
  international: [
    "Apple Computer — Canada","Maidenform — Jamaica",
    "McDonald's — Brazil / Uruguay / Bolivia","McDonald's — Jamaica / Panama / Costa Rica",
    "Marriott Hotels — WDC / AZ / CA","Hyatt Hotels — NYC / CA / HI",
    "Plaza Hotel NYC","U.S. Bankruptcy Court — AZ / CA / NY","FDIC",
    "Hewlett-Packard — Silicon Valley","Federal Reserve Bank of San Francisco",
    "U.S. Postal Service","Wells Fargo Bank","Bank of America",
  ],
  prLocal: [
    "Marland Engineering Services","Bradbury Company","Comercial Mendoza",
    "Top Meat Restaurant","Rona Distributors","Orinoco Machine Shop",
    "Globo School Supplies","MTS Electronics","Borinquen Lithographers",
    "H.T. Enterprises","Life Uniforms","LeOrchid Manufacturing (San Sebastián)",
    "Tomro Leather Manufacturing (San Lorenzo)","Klein Clothing Manufacturers",
    "Botín Restaurant","RV Trucking","Novatek, Inc. (Caguas)",
    "Productos Circuitos (Juana Díaz)","Sea Horse Trucking, Inc.","Avetek Electronics",
    "La Bowlera","Pollo Campero","Casa Lola's","MBTI Trade Schools","Taylor Koolee",
    "Cueva del Cangrejo Rest.","Marnit Constructores","Caricatura Rest.",
    "Star Wire Products","Lausell of PR","Avatar",
  ],
};

export const featuredSuccession = [
  { year: 1977, entity: 'A.R.S Auctioneers',          city: 'San Francisco, CA' },
  { year: 1988, entity: 'A.R. Pagán & Co.',           city: 'San Francisco, CA' },
  { year: 1992, entity: 'A.R. Pagán PR, Inc.',        city: 'San Juan, PR' },
  { year: 1996, entity: 'A.R. Pagán Auction Group',    city: 'US + PR' },
];
