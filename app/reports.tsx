import React, { useEffect, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { getSaleDetails, getSales } from '../lib/db';

type Sale = {
  id: number;
  date: string;
  total: number;
};

type SaleItem = {
  name: string;
  quantity: number;
  price: number;
};

export default function ReportsScreen() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [saleItems, setSaleItems] = useState<SaleItem[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchSales = async () => {
      const result = await getSales();
      setSales(result);
    };

    fetchSales();
  }, []);

  const openSaleDetail = async (sale: Sale) => {
    const items = await getSaleDetails(sale.id);
    setSelectedSale(sale);
    setSaleItems(items);
    setModalVisible(true);
  };

  const formatDate = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Historial de Ventas</Text>

      <FlatList
        data={sales}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable
            style={styles.saleItem}
            onPress={() => openSaleDetail(item)}
          >
            <Text style={styles.saleDate}>{formatDate(item.date)}</Text>
            <Text style={styles.saleTotal}>Total: ${item.total.toFixed(2)}</Text>
          </Pressable>
        )}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>🧾 Detalle de Venta</Text>
          <Text style={styles.modalSubtitle}>
            Fecha: {selectedSale ? formatDate(selectedSale.date) : ''}
          </Text>

          <FlatList
            data={saleItems}
            keyExtractor={(item, index) => `${item.name}-${index}`}
            renderItem={({ item }) => (
              <View style={styles.itemRow}>
                <Text>{item.name}</Text>
                <Text>
                  x{item.quantity} - ${(item.quantity * item.price).toFixed(2)}
                </Text>
              </View>
            )}
          />

          <View style={styles.modalFooter}>
            <Text style={styles.totalText}>
              Total: ${selectedSale?.total.toFixed(2)}
            </Text>
            <Pressable
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 12 },
  saleItem: {
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 8,
  },
  saleDate: { fontSize: 16 },
  saleTotal: { fontSize: 16, fontWeight: 'bold' },
  modalContainer: { flex: 1, padding: 20, backgroundColor: '#fff' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 8 },
  modalSubtitle: { fontSize: 16, marginBottom: 16 },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  modalFooter: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 12,
  },
  totalText: { fontSize: 18, fontWeight: 'bold' },
  closeButton: {
    marginTop: 12,
    backgroundColor: '#0077cc',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeButtonText: { color: '#fff', fontSize: 16 },
});
