import { CameraView } from 'expo-camera';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  deleteProduct,
  getProductById,
  insertProduct,
  updateProduct,
} from '../lib/db';

export default function ProductFormScreen() {
  const router = useRouter();
  const { id, barcode } = useLocalSearchParams();

  const isEdit = !!id;

  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [salePrice, setSalePrice] = useState('');
  const [stock, setStock] = useState('');
  const [barcodeValue, setBarcode] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const loadProduct = async () => {
        try {
          const product = await getProductById(Number(id));
          setName(product.name);
          setPurchasePrice(product.purchasePrice?.toString() ?? '');
          setSalePrice(product.salePrice?.toString() ?? '');
          setStock(product.stock?.toString() ?? '');
          setBarcode(product.barcode ?? '');
        } catch (error) {
          Alert.alert('Error', 'No se pudo cargar el producto.');
        }
      };
      loadProduct();
    } else if (barcode) {
      setBarcode(barcode.toString());
    }
  }, [id, barcode]);

  const handleSave = async () => {
    if (!name || !purchasePrice || !salePrice) {
      Alert.alert('Campos requeridos', 'Completa nombre, precio de compra y venta.');
      return;
    }

    const productData = {
      name,
      purchasePrice: parseFloat(purchasePrice),
      salePrice: parseFloat(salePrice),
      stock: stock ? parseInt(stock) : 0,
      barcode: barcodeValue || null,
    };

    try {
      if (isEdit) {
        await updateProduct(Number(id), productData);
        Alert.alert('Producto actualizado');
      } else {
        await insertProduct(productData);
        Alert.alert('Producto guardado');
      }
      router.back();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar el producto.');
      console.error(error);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Eliminar', '¿Deseas eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteProduct(Number(id));
            Alert.alert('Producto eliminado');
            router.back();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el producto.');
          }
        },
      },
    ]);
  };

  const handleBarcodeScannedInForm = ({ data }: { data: string }) => {
    setIsCameraOpen(false);
    setBarcode(data);
    Alert.alert('Código escaneado', `Se asignó el código: ${data}`);
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
        value={barcodeValue}
        onChangeText={setBarcode}
      />

      <Pressable style={styles.scanButton} onPress={() => setIsCameraOpen(true)}>
        <Text style={styles.scanButtonText}>📷 Escanear código</Text>
      </Pressable>

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

      <Modal visible={isCameraOpen} animationType="slide">
        <CameraView
          style={StyleSheet.absoluteFillObject}
          onBarcodeScanned={handleBarcodeScannedInForm}
          barcodeScannerSettings={{
            barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8', 'upc_a'],
          }}
        />
        <View style={styles.cameraOverlay}>
          <Button title="Cerrar" onPress={() => setIsCameraOpen(false)} />
        </View>
      </Modal>
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
  scanButton: {
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
    alignItems: 'center',
  },
  scanButtonText: {
    color: '#fff',
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
  cameraOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
});
