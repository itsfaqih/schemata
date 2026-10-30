import { spawnSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { promisify } from 'node:util';
import { brotliCompress, constants } from 'node:zlib';

const rootDir = path.resolve(import.meta.dirname, '..');

const distDir = path.join(rootDir, 'dist');

const compress = promisify(brotliCompress);

const contentTypes = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.woff2', 'font/woff2'],
  ['.woff', 'font/woff'],
]);

const compressible = new Set(['.html', '.js', '.css', '.svg']);

async function readAsset(urlPath: string): Promise<{ body: Buffer; extension: string }> {
  const filePath = path.join(distDir, path.normalize(urlPath));

  if (filePath.startsWith(distDir) && urlPath !== '/') {
    const body = await readFile(filePath).catch(() => null);

    if (body) {
      return { body, extension: path.extname(filePath) };
    }
  }

  return { body: await readFile(path.join(distDir, 'index.html')), extension: '.html' };
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');

  const build = spawnSync(process.execPath, [viteBin, 'build', '--logLevel', 'warn'], {
    cwd: rootDir,
    stdio: 'inherit',
  });

  if (build.status !== 0) {
    throw new Error(`vite build exited with ${String(build.status)}`);
  }

  // Serves dist the way Cloudflare serves production: brotli at about quality 4 for text assets
  const server = createServer((request, response) => {
    const urlPath = new URL(request.url ?? '/', 'http://localhost').pathname;

    void readAsset(urlPath).then(async ({ body, extension }) => {
      const headers = new Map([
        ['content-type', contentTypes.get(extension) ?? 'application/octet-stream'],
      ]);

      const acceptsBrotli = request.headers['accept-encoding']?.includes('br') ?? false;

      if (compressible.has(extension) && acceptsBrotli) {
        headers.set('content-encoding', 'br');
        response.writeHead(200, Object.fromEntries(headers));
        response.end(await compress(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 4 } }));

        return;
      }

      response.writeHead(200, Object.fromEntries(headers));
      response.end(body);
    });
  });

  const port = await new Promise<number>((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Node types the address as a pipe name or a TCP address; a TCP listener gives the latter
      if (address === null || typeof address === 'string') {
        reject(new Error('Could not read the server port'));

        return;
      }

      resolve(address.port);
    });
  });

  process.env['PERF_BASE_URL'] = `http://127.0.0.1:${port}`;

  return async () => {
    await new Promise((resolve) => server.close(resolve));
  };
}
