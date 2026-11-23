import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { auction } from './sanity/auction';

export default defineConfig({
  name: 'arpagan',
  title: 'A.R. Pagán — Panel de Subastas',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID || 'placeholder',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET || 'production',
  basePath: '/admin',
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Panel')
          .items([S.documentTypeListItem('auction').title('Subastas')]),
    }),
  ],
  schema: { types: [auction] },
});
