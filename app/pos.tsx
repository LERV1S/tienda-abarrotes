import { CameraView } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  CartItem,
  createSale,
  getProductByBarcode,
  getProducts,
} from '../lib/db';

type Product = {
  id: number;
  name: string;
  salePrice: number;
  purchasePrice: number;
  stock: number;
  barcode?: string | null;
};

export default function PosScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchText, setSearchText] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
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
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
          purchasePrice: product.purchasePrice ?? 0,
        },
      ]);
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

  const handleFinishSale = async () => {
    if (cart.length === 0) {
      Alert.alert('Venta vacía', 'Agrega productos al carrito primero.');
      return;
    }

    try {
      await createSale(cart);
      Alert.alert('Venta registrada', `Total: $${total.toFixed(2)}`);
      setCart([]);
      setSearchText('');
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la venta.');
      console.error(error);
    }
  };

  const handleBarcodeScanned = async ({ data }: { data: string }) => {
    setIsCameraOpen(false);

    try {
      const found = await getProductByBarcode(data);
      if (found) {
        addToCart(found);
        Alert.alert('Producto agregado', found.name);
      } else {
        Alert.alert('No encontrado', '¿Deseas agregar este producto?', [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Agregar',
            onPress: () => router.push(`/product-form?barcode=${data}`),
          },
        ]);
      }
    } catch (err) {
      Alert.alert('Error', 'No se pudo buscar el producto.');
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧾 Punto de Venta</Text>

      <TextInput
        placeholder="Buscar producto..."
        value={searchText}
        onChangeText={setSearchText}
        style={styles.searchInput}
      />

      <Pressable style={styles.scanButton} onPress={() => setIsCameraOpen(true)}>
        <Text style={styles.scanButtonText}>📷 Escanear producto</Text>
      </Pressable>

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

      <Modal visible={isCameraOpen} animationType="slide">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8', 'upc_a'],
          }}
        />
        <View style={styles.cameraOverlay}>
          <Button title="Cerrar" onPress={() => setIsCameraOpen(false)} />
        </View>
      </Modal>
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
  scanButton: {
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
    fontSize: 16,
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
  cameraOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
