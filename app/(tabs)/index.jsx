import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { deleteItem, loadItems } from "../../src/store/inventorySlice";

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const items = useSelector((s) => s.inventory?.items || []);

  useEffect(() => {
    dispatch(loadItems());
  }, [dispatch]);

  function openCreate() {
    router.push("/modal?mode=create");
  }

  function openEdit(it) {
    router.push(`/modal?mode=edit&id=${encodeURIComponent(String(it.id))}`);
  }

  function removeItem(it) {
    Alert.alert("Borrar", `¿Borrar "${it.name}"?`, [
      { text: "Cancelar", style: "cancel" },
      { text: "Borrar", style: "destructive", onPress: () => dispatch(deleteItem(it.id)) },
    ]);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>PharmaTory</Text>

        <Pressable style={styles.addBtn} onPress={openCreate}>
          <Text style={styles.addText}>+ Agregar</Text>
        </Pressable>
      </View>

      <FlatList
        data={items}
        keyExtractor={(it) => String(it.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.stock}>{item.stock}</Text>
            </View>

            {!!item.note && <Text style={styles.note}>{item.note}</Text>}

            <View style={styles.actions}>
              <Pressable style={styles.btn} onPress={() => openEdit(item)}>
                <Text style={styles.btnText}>Editar</Text>
              </Pressable>

              <Pressable style={styles.btn} onPress={() => removeItem(item)}>
                <Text style={styles.btnText}>Borrar</Text>
              </Pressable>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ opacity: 0.7 }}>Inventario vacío. Tocá “+ Agregar”.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 14, backgroundColor: "#fff" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  title: { fontSize: 22, fontWeight: "800" },

  addBtn: { backgroundColor: "#111", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 10 },
  addText: { color: "#fff", fontWeight: "800" },

  card: { borderWidth: 1, borderColor: "#eee", borderRadius: 14, padding: 14, marginBottom: 10, backgroundColor: "#fff" },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { fontSize: 18, fontWeight: "800" },
  stock: { fontWeight: "800" },
  note: { marginTop: 6, opacity: 0.75 },

  actions: { flexDirection: "row", gap: 10, marginTop: 10 },
  btn: { borderWidth: 1, borderColor: "#ddd", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  btnText: { fontWeight: "800" },
});