import { Link } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={null}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Tienda de Abarrotes</ThemedText>
      </ThemedView>

      <ThemedView style={styles.buttonGroup}>
        <Link href="/inventory" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>📦 Inventario</ThemedText>
          </Pressable>
        </Link>

        <Link href="/pos" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>🧾 Punto de Venta</ThemedText>
          </Pressable>
        </Link>

        <Link href="/purchase" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>🛒 Nueva Compra</ThemedText>
          </Pressable>
        </Link>

        <Link href="/scan" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>🔍 Escanear Producto</ThemedText>
          </Pressable>
        </Link>

        <Link href="/reports" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>📊 Reportes</ThemedText>
          </Pressable>
        </Link>

        <Link href="/settings" asChild>
          <Pressable style={styles.button}>
            <ThemedText style={styles.buttonText}>⚙️ Configuración</ThemedText>
          </Pressable>
        </Link>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginVertical: 30,
    alignItems: 'center',
  },
  buttonGroup: {
    gap: 12,
    paddingHorizontal: 16,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#008080',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
});
