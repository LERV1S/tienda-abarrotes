import { openDatabaseSync } from 'expo-sqlite';

const db = openDatabaseSync('abarrotes.db');

export const initDB = () => {
  db.execAsync(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      purchasePrice REAL,
      salePrice REAL,
      stock INTEGER,
      barcode TEXT
    );
  `);
};

export const getProducts = async (): Promise<any[]> => {
  const result = await db.getAllAsync('SELECT * FROM products');
  return result;
};

export const getProductById = async (id: number): Promise<any> => {
  const result = await db.getFirstAsync('SELECT * FROM products WHERE id = ?', [id]);
  return result;
};

export const insertProduct = async (product: {
  name: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  barcode?: string;
}): Promise<void> => {
  await db.runAsync(
    'INSERT INTO products (name, purchasePrice, salePrice, stock, barcode) VALUES (?, ?, ?, ?, ?)',
    [
      product.name,
      product.purchasePrice,
      product.salePrice,
      product.stock,
      product.barcode ?? null,
    ]
  );
};

export const updateProduct = async (
  id: number,
  product: Partial<any>
): Promise<void> => {
  await db.runAsync(
    `UPDATE products SET name = ?, purchasePrice = ?, salePrice = ?, stock = ?, barcode = ? WHERE id = ?`,
    [
      product.name,
      product.purchasePrice,
      product.salePrice,
      product.stock,
      product.barcode ?? null,
      id,
    ]
  );
};

export const deleteProduct = async (id: number): Promise<void> => {
  await db.runAsync('DELETE FROM products WHERE id = ?', [id]);
};

export default db;
