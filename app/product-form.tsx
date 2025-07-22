import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';

type Product = {
  id: number;
  name: string;
  purchasePrice: number;
  salePrice: number;
  stock: number;
  barcode?: string;
};

const MOCK_PRODUCTS: Product[] = [
  { id: 1, name: 'Leche Alpura 1L', purchasePrice: 18, salePrice: 22, stock: 15 },
  { id: 2, name: 'Pan Bimbo', purchasePrice: 15, salePrice: 18.5, stock: 10 },
  { id: 3, name: 'Refresco Coca 2L', purchasePrice: 25, salePrice: 30, stock: 20 },
];

export default function ProductFormScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const isEdit = !!id;
  const existingProduct = MOCK_PRODUCTS.find((p) => p.id === Number(id));

  const [name, setName] = useState(existingProduct?.name ?? '');
  const [purchasePrice, setPurchasePrice] = useState(
    existingProduct?.purchasePrice.toString() ?? ''
  );
  const [salePrice, setSalePrice] = useState(
    existingProduct?.salePrice.toString() ?? ''
  );
  const [stock, setStock] = useState(existingProduct?.stock.toString() ?? '');
  const [barcode, setBarcode] = useState(existingProduct?.barcode ?? '');

  const handleSave = () => {
    if (!name || !purchasePrice || !salePrice) {
      Alert.alert('Campos requeridos', 'Completa los campos obligatorios.');
      return;
    }

    const data = {
      id: isEdit ? Number(id) : Date.now(),
      name,
      purchasePrice: parseFloat(purchasePrice),
      salePrice: parseFloat(salePrice),
      stock: stock ? parseInt(stock) : 0,
      barcode,
    };

    console.log(isEdit ? 'Producto actualizado:' : 'Producto nuevo:', data);
    Alert.alert('Éxito', `Producto ${isEdit ? 'actualizado' : 'guardado'}`);
    router.back();
  };

  const handleDelete = () => {
    Alert.alert('Eliminar', '¿Estás seguro que deseas eliminar este producto?', [
      {
        text: 'Cancelar',
        style: 'cancel',
      },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () => {
          console.log('Producto eliminado:', existingProduct?.id);
          router.back();
        },
      },
    ]);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {isEdit ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
      </Text>

      <TextInput
        placeholder="Nombre del producto"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Precio de compra"
        style={styles.input}
        keyboardType="decimal-pad"
        value={purchasePrice}
        onChangeText={setPurchasePrice}
      />

      <TextInput
        placeholder="Precio de venta"
        style={styles.input}
        keyboardType="decimal-pad"
        value={salePrice}
        onChangeText={setSalePrice}
      />

      <TextInput
        placeholder="Stock estimado"
        style={styles.input}
        keyboardType="number-pad"
        value={stock}
        onChangeText={setStock}
      />

      <TextInput
        placeholder="Código de barras (opcional)"
        style={styles.input}
        value={barcode}
        onChangeText={setBarcode}
      />

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>
          {isEdit ? 'Guardar Cambios' : 'Guardar Producto'}
        </Text>
      </Pressable>

      {isEdit && (
        <Pressable style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.deleteButtonText}>🗑️ Eliminar Producto</Text>
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 16,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: { color: '#fff', fontSize: 16 },
  deleteButton: {
    backgroundColor: '#cc0000',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: { color: '#fff', fontSize: 16 },
});
