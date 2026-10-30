import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:net';
import path from 'node:path';

const rootDir = path.resolve(import.meta.dirname, '..');

const startupTimeoutMs = 60_000;

async function findFreePort(): Promise<number> {
  return await new Promise((resolve, reject) => {
    const server = createServer();

    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => {
      const address = server.address();

      // oxlint-disable-next-line anti-slop/no-runtime-typeof -- Node types the address as a pipe name or a TCP address; a TCP listener gives the latter
      if (address === null || typeof address === 'string') {
        reject(new Error('Could not read the free port'));

        return;
      }

      server.close(() => resolve(address.port));
    });
  });
}

async function waitForApp(url: string): Promise<void> {
  const deadline = Date.now() + startupTimeoutMs;

  while (Date.now() < deadline) {
    const answered = await fetch(url).then(
      (response) => response.ok,
      () => false,
    );

    if (answered) {
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`App at ${url} did not answer within ${startupTimeoutMs / 1000}s`);
}

export default async function globalSetup(): Promise<() => Promise<void>> {
  if (!existsSync(path.join(rootDir, 'dist', 'index.html'))) {
    throw new Error('dist/ is missing: run `vp run test:e2e`, which builds the app first');
  }

  const port = await findFreePort();
  const url = `http://127.0.0.1:${port}`;

  const app = spawn(
    process.execPath,
    [
      path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js'),
      'preview',
      '--port',
      String(port),
      '--strictPort',
      '--host',
      '127.0.0.1',
    ],
    { cwd: rootDir, stdio: ['ignore', 'ignore', 'inherit'] },
  );

  try {
    await waitForApp(url);
  } catch (error) {
    app.kill();
    throw error;
  }

  process.env['E2E_BASE_URL'] = url;

  return async () => {
    app.kill();
  };
}
