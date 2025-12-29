import * as SQLite from "expo-sqlite";

let dbPromise = null;

async function getDb() {
  if (!dbPromise) dbPromise = SQLite.openDatabaseAsync("pharmatory.db");
  return dbPromise;
}

export async function initDb() {
  const db = await getDb();

  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS items (
      id TEXT PRIMARY KEY NOT NULL,
      name TEXT NOT NULL,
      stock INTEGER NOT NULL,
      note TEXT,
      photoUri TEXT
    );
  `);

  
  try {
    await db.execAsync(`ALTER TABLE items ADD COLUMN photoUri TEXT;`);
  } catch (e) {}
}

export async function getItems() {
  const db = await getDb();
  await initDb();
  const rows = await db.getAllAsync("SELECT * FROM items ORDER BY rowid DESC;");
  return rows ?? [];
}

export async function upsertItemDb(item) {
  const db = await getDb();
  await initDb();
  await db.runAsync(
    "INSERT OR REPLACE INTO items (id, name, stock, note, photoUri) VALUES (?, ?, ?, ?, ?);",
    [
      item.id,
      item.name,
      Number(item.stock ?? 0),
      item.note ?? "",
      item.photoUri ?? "",
    ]
  );
  return true;
}

export async function deleteItemDb(id) {
  const db = await getDb();
  await initDb();
  await db.runAsync("DELETE FROM items WHERE id = ?;", [id]);
  return true;
}

export async function replaceAllItemsDb(items) {
  const db = await getDb();
  await initDb();
  await db.runAsync("DELETE FROM items;");
  for (const it of items || []) {
    await upsertItemDb(it);
  }
  return true;
}