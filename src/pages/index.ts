import { base64UrlToSchema } from '@/utils/schema';
import { createRootRoute, createRoute, createRouter, ErrorComponent } from '@tanstack/react-router';
import { z } from 'zod';
import { Editor } from './Editor';

const rootRoute = createRootRoute();

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Editor,
  validateSearch: z.object({
    schema: z.string().optional(),
  }),
  loaderDeps: ({ search }) => ({ schema: search.schema }),
  loader: ({ deps }) => ({
    schema: deps.schema ? base64UrlToSchema(deps.schema) : null,
  }),
  errorComponent: ErrorComponent,
});

export const router = createRouter({
  routeTree: rootRoute.addChildren([editorRoute]),
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
