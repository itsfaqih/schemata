import { SchemaType } from '@/schemas/schema';
import { base64UrlToSchema } from '@/utils/schema';
import { createRouteConfig, createReactRouter } from '@tanstack/react-router';
import { z } from 'zod';
import { Editor } from './Editor';

export const rootRoute = createRouteConfig();

function routeConfig() {
  return rootRoute.addChildren([
    rootRoute.createRoute({
      path: '/',
      component: Editor,
      async loader({ search }) {
        const { schema: base64Schema } = search;

        const schema: SchemaType | null = base64Schema ? base64UrlToSchema(base64Schema) : null;

        return {
          schema,
        };
      },
      validateSearch: z.object({
        schema: z.string().optional(),
      }),
    }),
  ]);
}

export function router() {
  return createReactRouter({
    routeConfig: routeConfig(),
  });
}
