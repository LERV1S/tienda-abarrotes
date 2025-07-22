import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';

export default function ProductFormScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [barcode, setBarcode] = useState('');

  const handleSave = () => {
    if (!name || !purchasePrice || !salePrice) {
      Alert.alert('Campos requeridos', 'Completa los campos obligatorios.');
      return;
    }

    // Aquí se integrará con SQLite más adelante
    console.log('Producto guardado:', {
      name,
      purchasePrice: parseFloat(purchasePrice),
      salePrice: parseFloat(salePrice),
      stock: stock ? parseInt(stock) : 0,
      barcode,
    });

    Alert.alert('Éxito', 'Producto guardado correctamente');
    router.back(); // Regresar a pantalla anterior
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>➕ Nuevo Producto</Text>

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
        <Text style={styles.saveButtonText}>Guardar producto</Text>
      </Pressable>
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
});
