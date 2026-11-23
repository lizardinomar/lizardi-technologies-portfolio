import { defineField, defineType } from 'sanity';

// Todo lo que ve Luzette está en español y en palabras simples.
// Orden pensado como una receta: nombre → fecha → fotos → texto → catálogo.
export const auction = defineType({
  name: 'auction',
  title: 'Subasta',
  type: 'document',
  groups: [
    { name: 'basic', title: '1 · Lo básico', default: true },
    { name: 'photos', title: '2 · Fotos' },
    { name: 'text', title: '3 · Textos (ES / EN)' },
    { name: 'catalog', title: '4 · Catálogo' },
    { name: 'extra', title: '5 · Extras (opcional)' },
  ],
  fields: [
    // ── 1 · LO BÁSICO ───────────────────────────────────────────
    defineField({
      name: 'hideFromSite',
      title: 'Ocultar esta subasta del sitio',
      description: 'Actívalo y presiona Publish para quitarla de arpagan.com sin borrarla. Desactívalo para que vuelva a aparecer.',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
    }),
    defineField({
      name: 'title',
      title: 'Nombre de la subasta',
      description: 'Ej.: European Furnishings',
      type: 'string',
      group: 'basic',
      validation: (r) => r.required().error('Escribe el nombre de la subasta'),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtítulo (opcional)',
      description: 'Ej.: Public Auction · Subasta Pública',
      type: 'string',
      group: 'basic',
    }),
    defineField({
      name: 'startDate',
      title: 'Fecha y hora de la subasta',
      description: 'Cuando la subasta se celebra o abre. La hora es la de Puerto Rico.',
      type: 'datetime',
      group: 'basic',
      validation: (r) => r.required().error('Escoge la fecha y hora'),
    }),
    defineField({
      name: 'endDate',
      title: 'Fecha y hora de cierre (opcional)',
      description: 'Si no pones nada, la subasta pasa sola a "Subastas Pasadas" al día siguiente.',
      type: 'datetime',
      group: 'basic',
    }),
    defineField({ name: 'venue', title: 'Lugar (nombre)', description: 'Ej.: Salón de eventos Restaurante El Tenedor', type: 'string', group: 'basic' }),
    defineField({ name: 'address', title: 'Dirección', description: 'Ej.: #1 Calle Emilia Príncipe, Bo. Madrid', type: 'string', group: 'basic' }),
    defineField({ name: 'city', title: 'Ciudad', type: 'string', group: 'basic', initialValue: 'Juncos, PR' }),
    defineField({ name: 'zip', title: 'Código postal', type: 'string', group: 'basic' }),

    // ── 2 · FOTOS ───────────────────────────────────────────────
    defineField({
      name: 'gallery',
      title: 'Fotos de la subasta',
      description: 'Arrastra todas las fotos aquí de una vez. La PRIMERA foto es la portada (puedes arrastrarlas para cambiar el orden).',
      type: 'array',
      group: 'photos',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'alt', title: 'Descripción corta (opcional)', type: 'string' }),
          ],
        },
      ],
      options: { layout: 'grid' },
    }),

    // ── 3 · TEXTOS ──────────────────────────────────────────────
    defineField({
      name: 'descriptionEs',
      title: 'Descripción — Español',
      description: 'Qué se vende. Dos o tres oraciones bastan.',
      type: 'text',
      rows: 4,
      group: 'text',
    }),
    defineField({
      name: 'descriptionEn',
      title: 'Description — English',
      type: 'text',
      rows: 4,
      group: 'text',
    }),
    defineField({
      name: 'highlightsEs',
      title: 'Qué se vende (lista) — Español',
      description: 'Una línea por cada categoría. Ej.: Sofás y sillones, Mesas de comedor, Lámparas.',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'text',
    }),
    defineField({
      name: 'highlightsEn',
      title: 'What is for sale (list) — English',
      type: 'array',
      of: [{ type: 'string' }],
      group: 'text',
    }),
    defineField({
      name: 'inspectionEs',
      title: 'Inspección / visita previa — Español',
      description: 'Ej.: Viernes 4 de diciembre, 9:00 AM – 3:00 PM, y desde las 8:00 AM el día de la subasta.',
      type: 'text',
      rows: 2,
      group: 'text',
    }),
    defineField({
      name: 'inspectionEn',
      title: 'Inspection / preview — English',
      type: 'text',
      rows: 2,
      group: 'text',
    }),

    // ── 4 · CATÁLOGO ────────────────────────────────────────────
    defineField({
      name: 'catalogPdf',
      title: 'Catálogo (archivo PDF)',
      description: 'Sube el PDF aquí. El botón "Ver catálogo" aparece solo en la página de la subasta.',
      type: 'file',
      options: { accept: 'application/pdf' },
      group: 'catalog',
    }),
    defineField({
      name: 'catalogLink',
      title: 'Catálogo (enlace)',
      description: 'Úsalo si el catálogo está en otro sitio (ej. BidSpotter). Si subiste el PDF, deja esto vacío.',
      type: 'url',
      group: 'catalog',
    }),
    defineField({
      name: 'lotCount',
      title: 'Cantidad de lotes (opcional)',
      type: 'number',
      group: 'catalog',
    }),

    // ── 5 · EXTRAS ──────────────────────────────────────────────
    defineField({
      name: 'bidspotterUrl',
      title: 'Enlace de BidSpotter (solo si es distinto al de siempre)',
      description: 'Déjalo vacío: el botón usa automáticamente la página de A.R. Pagán en BidSpotter.',
      type: 'url',
      group: 'extra',
    }),
    defineField({
      name: 'customTerms',
      title: 'Términos especiales de esta subasta',
      description: 'Solo si esta subasta tiene condiciones distintas a las normales.',
      type: 'text',
      rows: 4,
      group: 'extra',
    }),

    // ── Campos viejos (subastas anteriores). Ocultos. ───────────
    defineField({ name: 'description', type: 'text', hidden: true }),
    defineField({ name: 'highlights', type: 'array', of: [{ type: 'string' }], hidden: true }),
    defineField({ name: 'previewInfo', type: 'string', hidden: true }),
  ],
  orderings: [
    { title: 'Más reciente primero', name: 'dateDesc', by: [{ field: 'startDate', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'title', date: 'startDate', media: 'gallery.0', hidden: 'hideFromSite' },
    prepare: ({ title, date, media, hidden }) => ({
      title: hidden ? `(Oculta) ${title}` : title,
      subtitle: date ? new Date(date).toLocaleDateString('es-PR', { dateStyle: 'long' }) : 'Sin fecha',
      media,
    }),
  },
});
