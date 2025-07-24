import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import { getProductByBarcode } from '../lib/db';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<any>(null);
  const router = useRouter();

  if (!permission) return <Text>Cargando permisos...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Se necesita permiso para acceder a la cámara.</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      const product = await getProductByBarcode(data);

      if (product) {
        Alert.alert('Producto encontrado', `Redirigiendo a editar: ${product.name}`);
        router.push(`/product-form?id=${product.id}`);
      } else {
        Alert.alert('Nuevo producto', 'Redirigiendo a agregar uno nuevo.');
        router.push(`/product-form?barcode=${data}`);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo buscar el código en la base de datos.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8', 'upc_a'],
        }}
      />
      {scanned && (
        <Button title="Escanear otro código" onPress={() => setScanned(false)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
