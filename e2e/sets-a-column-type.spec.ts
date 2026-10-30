import { addTableAt, columns, openEditor } from './editor';
import { expect, test } from './fixtures';

const typesWithoutValues = [
  'CHAR',
  'VARCHAR',
  'BINARY',
  'VARBINARY',
  'TINYBLOB',
  'TINYTEXT',
  'TEXT',
  'BLOB',
  'MEDIUMTEXT',
  'MEDIUMBLOB',
  'LONGTEXT',
  'LONGBLOB',
  'BIT',
  'TINYINT',
  'BOOLEAN',
  'SMALLINT',
  'MEDIUMINT',
  'INTEGER',
  'BIGINT',
  'FLOAT',
  'DOUBLE',
  'DECIMAL',
  'DATETIME',
  'DATE',
  'TIMESTAMP',
  'TIME',
  'YEAR',
  'GEOMETRY',
  'POINT',
  'LINESTRING',
  'POLYGON',
  'MULTIPOINT',
  'MULTILINESTRING',
  'MULTIPOLYGON',
  'GEOMETRYCOLLECTION',
  'JSON',
];

const typesWithValues = ['ENUM', 'SET'];

for (const type of typesWithoutValues) {
  test(`sets a column type to ${type}`, async ({ page, step }) => {
    const table = page.getByTestId('table-node');

    await step('open the editor with table "users" and a new column', async () => {
      await openEditor(page);
      await addTableAt(page, 'users', { x: 150, y: 100 });
      await table.hover();
      await table.getByRole('button', { name: /add field/i }).click();
    });

    await step(`choose type ${type} and submit with Escape`, async () => {
      await table.getByRole('combobox', { name: 'Type' }).click();
      await page.getByTestId(`column-type-combobox-${type}`).click();
      await table.getByRole('combobox', { name: 'Type' }).press('Escape');
    });

    await step(`see the column typed ${type}`, async () => {
      await expect(table.getByRole('combobox', { name: 'Type' })).toHaveCount(0);
      await expect(columns(table).getByText(type, { exact: true })).toBeVisible();
    });
  });
}

for (const type of typesWithValues) {
  test(`sets a column type to ${type}`, async ({ page, step }) => {
    const table = page.getByTestId('table-node');

    await step('open the editor with table "users" and a new column', async () => {
      await openEditor(page);
      await addTableAt(page, 'users', { x: 150, y: 100 });
      await table.hover();
      await table.getByRole('button', { name: /add field/i }).click();
    });

    await step(`choose type ${type}, add the value "baz" and submit with Enter`, async () => {
      await table.getByRole('combobox', { name: 'Type' }).click();
      await page.getByTestId(`column-type-combobox-${type}`).click();
      await table.getByRole('combobox', { name: 'Values' }).fill('baz');
      await table.getByRole('combobox', { name: 'Values' }).press('Enter');
      await table.getByRole('combobox', { name: 'Values' }).press('Enter');
    });

    await step(`see the column typed ${type}`, async () => {
      await expect(table.getByRole('combobox', { name: 'Type' })).toHaveCount(0);
      await expect(columns(table).getByText(type, { exact: true })).toBeVisible();
    });
  });
}
