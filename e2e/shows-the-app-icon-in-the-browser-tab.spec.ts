import { openEditor } from './editor';
import { expect, test } from './fixtures';

// The Slit S mark: a rounded square cut by two slits, each ending in a round handle.
const SLIT_S_PATH =
  'd="M64 0H192A64 64 0 0 1 256 64H97.89A24 24 0 1 0 97.89 96H256V192A64 64 0 0 1 192 256H64A64 64 0 0 1 0 192H158.11A24 24 0 1 0 158.11 160H0V64A64 64 0 0 1 64 0Z"';

test('shows the app icon in the browser tab', async ({ page, step }) => {
  await step('open the editor', async () => {
    await openEditor(page);
  });

  await step('see the Slit S as the tab icon, light on dark tabs', async () => {
    // <link> elements in <head> have no role or name, so they are located by attribute.
    await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute(
      'href',
      '/schemata.svg',
    );
    const svg = await (await page.request.get('/schemata.svg')).text();
    expect(svg).toContain(SLIT_S_PATH);
    expect(svg).toContain('@media (prefers-color-scheme:dark){path{fill:#f1f5f9}}');
  });

  await step('get the ICO and Apple touch icon fallbacks', async () => {
    await expect(page.locator('link[rel="icon"][sizes="48x48"]')).toHaveAttribute(
      'href',
      '/favicon.ico',
    );
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      '/apple-touch-icon.png',
    );
    const ico = await (await page.request.get('/favicon.ico')).body();
    // ICONDIR header: reserved 0, type 1 (icon), 3 images (16, 32, 48 px).
    expect([...ico.subarray(0, 6)]).toEqual([0, 0, 1, 0, 3, 0]);
    const png = await (await page.request.get('/apple-touch-icon.png')).body();
    // PNG IHDR width and height, big-endian: 180 x 180.
    expect([png.readUInt32BE(16), png.readUInt32BE(20)]).toEqual([180, 180]);
  });
});
