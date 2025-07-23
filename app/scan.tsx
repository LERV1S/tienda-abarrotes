import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useRef, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const cameraRef = useRef<any>(null);

  if (!permission) return <Text>Cargando permisos...</Text>;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Se necesita permiso para acceder a la cámara.</Text>
        <Button title="Conceder permiso" onPress={requestPermission} />
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    Alert.alert('Código escaneado', `Tipo: ${type}\nDato: ${data}`);
  };

  return (
    <View style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'code128', 'code39', 'ean13', 'ean8'],
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