import { StyleSheet, Text, View } from 'react-native';

export default function ScreenName() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pantalla en construcción</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 20 },
});
