import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

type Product = {
  id: number;
  name: string;
  price: number;
  stock?: number;
};

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Leche Alpura 1L', price: 22.0, stock: 15 },
  { id: 2, name: 'Pan Bimbo', price: 18.5, stock: 10 },
  { id: 3, name: 'Refresco Coca 2L', price: 30.0, stock: 20 },
];

export default function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Simulamos carga de datos (en el futuro se cargará desde SQLite)
    setProducts(MOCK_PRODUCTS);
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📦 Inventario</Text>

      <TextInput
        placeholder="Buscar producto..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/product-form?id=${item.id}`)}>
                <View style={styles.productCard}>
                    <Text style={styles.productName}>{item.name}</Text>
                    <Text style={styles.productDetail}>${item.price.toFixed(2)}</Text>
                    <Text style={styles.productStock}>
                    Stock: {item.stock ?? 'N/D'}
                    </Text>
                </View>
            </Pressable>
        )}
      />

      <Pressable
        style={styles.addButton}
        onPress={() => router.push('/product-form')}
      >
        <Text style={styles.addButtonText}>➕ Agregar Producto</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  productCard: {
    padding: 16,
    marginBottom: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  productName: { fontSize: 18, fontWeight: 'bold' },
  productDetail: { fontSize: 16 },
  productStock: { fontSize: 14, color: '#555' },
  addButton: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: { color: '#fff', fontSize: 16 },
});
