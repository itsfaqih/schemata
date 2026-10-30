import { base64UrlToSchema, emptySchemaFactory } from '@/utils/schema';
import { openSchema, readCurrentSchema } from '@/utils/schema-storage';
import {
  createRootRoute,
  createRoute,
  createRouter,
  ErrorComponent,
  redirect,
} from '@tanstack/react-router';
import { z } from 'zod/mini';
import { Editor } from './Editor';

const rootRoute = createRootRoute();

const editorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Editor,
  validateSearch: z.object({
    schema: z.optional(z.string()),
  }),
  loaderDeps: ({ search }) => ({ schema: search.schema }),
  // A shared link is imported once and dropped from the address bar, so a reload opens the latest edits
  loader: async ({ deps }) => {
    if (deps.schema) {
      await openSchema(base64UrlToSchema(deps.schema));

      throw redirect({ to: '/', search: {}, replace: true });
    }

    const storedSchema = await readCurrentSchema();

    if (storedSchema) {
      return { schema: storedSchema };
    }

    const schema = emptySchemaFactory();

    await openSchema(schema);

    return { schema };
  },
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
