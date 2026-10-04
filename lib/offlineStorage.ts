import { openDB } from 'idb';

const DB_NAME = 'urbaniq-offline-db';
const STORE_NAME = 'pending-reports';

export async function initDB() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
      }
    },
  });
}

export async function saveOfflineReport(reportData: Record<string, any>) {
  const db = await initDB();
  await db.add(STORE_NAME, { ...reportData, timestamp: Date.now() });
}

export async function getOfflineReports() {
  const db = await initDB();
  return db.getAll(STORE_NAME);
}

export async function clearOfflineReports() {
  const db = await initDB();
  await db.clear(STORE_NAME);
}