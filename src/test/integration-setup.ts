import localforage from 'localforage';

// Browser-mode test files share one origin, so each file gets its own IndexedDB database.
localforage.config({ name: `schemata-test-${crypto.randomUUID()}` });
