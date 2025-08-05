import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
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
  barcode?: string;
};

type CartItem = Product & {
  quantity: number;
};

export default function SellScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    loadProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item.id === product.id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(1, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.salePrice * item.quantity,
    0
  );

  const handleFinishSale = () => {
    if (cart.length === 0) {
      Alert.alert('Venta vacía', 'Agrega productos al carrito primero.');
      return;
    }

    Alert.alert('Venta realizada', `Total: $${total.toFixed(2)}`);
    setCart([]);
    setSearchText('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Nueva Venta</Text>

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
          <Pressable
            style={styles.productItem}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>${item.salePrice.toFixed(2)}</Text>
          </Pressable>
        )}
      />

      <Text style={styles.subtitle}>🛒 Carrito</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyCart}>No hay productos agregados.</Text>
      ) : (
        <FlatList
          data={cart}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.cartItem}>
              <Text style={styles.cartText}>
                {item.name} x{item.quantity}
              </Text>
              <View style={styles.qtyControls}>
                <Pressable onPress={() => updateQuantity(item.id, -1)}>
                  <Text style={styles.qtyButton}>➖</Text>
                </Pressable>
                <Pressable onPress={() => updateQuantity(item.id, 1)}>
                  <Text style={styles.qtyButton}>➕</Text>
                </Pressable>
              </View>
              <Text style={styles.cartText}>
                ${(item.salePrice * item.quantity).toFixed(2)}
              </Text>
            </View>
          )}
        />
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
        <Pressable style={styles.finishButton} onPress={handleFinishSale}>
          <Text style={styles.finishButtonText}>💰 Finalizar Venta</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  subtitle: { fontSize: 18, fontWeight: 'bold', marginTop: 16 },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  productItem: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
  },
  productName: { fontSize: 16 },
  productPrice: { fontSize: 14, color: '#444' },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  cartText: { fontSize: 16 },
  qtyControls: {
    flexDirection: 'row',
    gap: 12,
  },
  qtyButton: { fontSize: 18 },
  totalContainer: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 12 },
  finishButton: {
    backgroundColor: '#008080',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  finishButtonText: { color: '#fff', fontSize: 16 },
  emptyCart: { color: '#777', fontStyle: 'italic' },
});
