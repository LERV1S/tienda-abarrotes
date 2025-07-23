import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { getProducts } from '../lib/db';

type Product = {
  id: number;
  name: string;
  salePrice: number;
  stock?: number;
};

export default function InventoryScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  // Recargar productos cada vez que la pantalla se enfoque
  useFocusEffect(
    useCallback(() => {
      const loadProducts = async () => {
        try {
          const data = await getProducts();
          setProducts(data);
        } catch (error) {
          console.error('Error al cargar productos:', error);
        }
      };
      loadProducts();
    }, [])
  );

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
              <Text style={styles.productDetail}>${item.salePrice.toFixed(2)}</Text>
              <Text style={styles.productStock}>
                Stock: {item.stock ?? 'N/D'}
              </Text>
            </View>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 30, color: '#999' }}>
            No hay productos
          </Text>
        }
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
