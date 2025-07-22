import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('abarrotes.db');

export const initDB = () => {
  db.transaction((tx) => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        purchasePrice REAL,
        salePrice REAL,
        stock INTEGER,
        barcode TEXT
      );`
    );
  });
};

export const getProducts = (): Promise<any[]> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products;',
        [],
        (_, result) => resolve(result.rows._array),
        (_, error) => reject(error)
      );
    });
  });

export const getProductById = (id: number): Promise<any> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM products WHERE id = ?;',
        [id],
        (_, result) => resolve(result.rows.item(0)),
        (_, error) => reject(error)
      );
    });
  });

export const insertProduct = (product: {
  name: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  barcode?: string;
}): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO products (name, purchasePrice, salePrice, stock, barcode) VALUES (?, ?, ?, ?, ?);',
        [
          product.name,
          product.purchasePrice,
          product.salePrice,
          product.stock,
          product.barcode,
        ],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });

export const updateProduct = (id: number, product: Partial<any>): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        `UPDATE products SET name = ?, purchasePrice = ?, salePrice = ?, stock = ?, barcode = ? WHERE id = ?;`,
        [
          product.name,
          product.purchasePrice,
          product.salePrice,
          product.stock,
          product.barcode,
          id,
        ],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });

export const deleteProduct = (id: number): Promise<void> =>
  new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        'DELETE FROM products WHERE id = ?;',
        [id],
        () => resolve(),
        (_, error) => reject(error)
      );
    });
  });

export default db;
