import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemas';
import { projectId, dataset } from './sanity/env';
import { structure } from './sanity/structure';

export default defineConfig({
  name: 'formulaihu',
  title: 'Formula IHU',
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool({ structure }), visionTool()],
  schema: {
    types: schemaTypes,
  },
});

