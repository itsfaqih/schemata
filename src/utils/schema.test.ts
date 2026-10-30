import * as fc from 'fast-check';
import { expect, it } from 'vitest';
import { SchemaType } from '@/schemas/schema';
import { base64UrlToSchema, emptySchemaFactory, schemaToBase64Url } from './schema';

const shop: SchemaType = {
  id: '6f9619ff-8b86-4d01-b42d-00cf4fc964ff',
  name: 'Shop',
  vendor: 'MYSQL:8.0',
  tables: [],
  groups: [],
  positions: [],
  relations: [],
};

const shopUrl =
  'eyJpZCI6IjZmOTYxOWZmLThiODYtNGQwMS1iNDJkLTAwY2Y0ZmM5NjRmZiIsIm5hbWUiOiJTaG9wIiwidmVuZG9yIjoiTVlTUUw6OC4wIiwidGFibGVzIjpbXSwiZ3JvdXBzIjpbXSwicG9zaXRpb25zIjpbXSwicmVsYXRpb25zIjpbXX0';

it('encodes a schema as base64url JSON', () => {
  expect(schemaToBase64Url(shop)).toBe(shopUrl);
});

it('decodes a shared schema URL', () => {
  expect(base64UrlToSchema(shopUrl)).toEqual(shop);
});

it('rejects a shared URL whose JSON is cut off', () => {
  expect(() => base64UrlToSchema('eyJpZCI6')).toThrow(SyntaxError);
});

it('rejects a shared schema for an unsupported vendor', () => {
  expect(() =>
    base64UrlToSchema(
      'eyJpZCI6IjZmOTYxOWZmLThiODYtNGQwMS1iNDJkLTAwY2Y0ZmM5NjRmZiIsIm5hbWUiOiJTaG9wIiwidmVuZG9yIjoiUE9TVEdSRVM6MTYiLCJ0YWJsZXMiOltdLCJncm91cHMiOltdLCJwb3NpdGlvbnMiOltdLCJyZWxhdGlvbnMiOltdfQ',
    ),
  ).toThrow(/vendor/);
});

it('starts a new schema empty, untitled and shareable', () => {
  const schema = emptySchemaFactory();

  expect(schema.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/,
  );
  expect(schema).toEqual({
    id: schema.id,
    name: 'Untitled',
    vendor: 'MYSQL:8.0',
    tables: [],
    groups: [],
    positions: [],
    relations: [],
  });
  expect(base64UrlToSchema(schemaToBase64Url(schema))).toEqual(schema);
  expect(emptySchemaFactory().id).not.toBe(schema.id);
});

const trimmedName = fc
  .string({ maxLength: 64, unit: 'grapheme' })
  .filter((name) => name.length <= 64 && name === name.trim());

const schemaArbitrary = fc.record({
  id: fc.uuid({ version: 4 }),
  name: trimmedName,
  vendor: fc.constant('MYSQL:8.0' as const),
  tables: fc.array(
    fc.record({
      id: fc.uuid({ version: 4 }),
      name: trimmedName,
      columns: fc.constant<never[]>([]),
      indexes: fc.constant<never[]>([]),
    }),
    { maxLength: 5 },
  ),
  groups: fc.constant<never[]>([]),
  positions: fc.array(
    fc.record({ itemId: fc.uuid({ version: 4 }), x: fc.integer(), y: fc.integer() }),
    { maxLength: 5 },
  ),
  relations: fc.constant<never[]>([]),
});

it('decodes every encoded schema back to itself', () => {
  fc.assert(
    fc.property(schemaArbitrary, (schema) => {
      expect(base64UrlToSchema(schemaToBase64Url(schema))).toEqual(schema);
    }),
  );
});
