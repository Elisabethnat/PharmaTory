import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { upsertItem } from "../src/store/inventorySlice";

export default function ModalScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const params = useLocalSearchParams();
  const mode = String(params?.mode || "create");

  const items = useSelector((s) => s.inventory?.items || []);

  const editingItem = useMemo(() => {
    if (mode !== "edit") return null;
    const id = String(params?.id || "");
    return items.find((x) => String(x.id) === id) || null;
  }, [mode, params, items]);

  const [name, setName] = useState(editingItem?.name || "");
  const [stock, setStock] = useState(editingItem?.stock != null ? String(editingItem.stock) : "0");
  const [note, setNote] = useState(editingItem?.note || "");
  const [photoUri, setPhotoUri] = useState(editingItem?.photoUri || "");

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permiso", "Necesito permiso de cámara para sacar la foto.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.6,
      allowsEditing: true,
    });

    if (!result.canceled && result.assets?.[0]?.uri) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  function save() {
    const cleanName = String(name || "").trim();
    if (!cleanName) {
      Alert.alert("Falta nombre", "Ingresá un nombre de producto.");
      return;
    }

    const it = {
      id: mode === "edit" ? String(editingItem?.id || params?.id) : String(Date.now()),
      name: cleanName,
      stock: Number(stock || 0),
      note: String(note || ""),
      photoUri: String(photoUri || ""),
      updatedAt: Date.now(),
    };

    dispatch(upsertItem(it));
    router.back();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mode === "edit" ? "Editar producto" : "Agregar producto"}</Text>

      <Text style={styles.label}>Nombre</Text>
      <TextInput value={name} onChangeText={setName} style={styles.input} placeholder="Ej: Ibuprofeno 400" />

      <Text style={styles.label}>Stock</Text>
      <TextInput value={stock} onChangeText={setStock} style={styles.input} keyboardType="numeric" />

      <Text style={styles.label}>Nota (opcional)</Text>
      <TextInput
        value={note}
        onChangeText={setNote}
        style={[styles.input, styles.textArea]}
        placeholder="Ej: caja x 10"
        multiline
      />

      <View style={{ marginTop: 14 }}>
        <Pressable style={styles.photoBtn} onPress={takePhoto}>
          <Text style={styles.photoBtnText}>Tomar foto</Text>
        </Pressable>

        {!!photoUri && <Image source={{ uri: photoUri }} style={styles.preview} />}
      </View>

      <View style={styles.row}>
        <Pressable style={[styles.btn, styles.btnGhost]} onPress={() => router.back()}>
          <Text style={styles.btnGhostText}>Cancelar</Text>
        </Pressable>

        <Pressable style={[styles.btn, styles.btnSolid]} onPress={save}>
          <Text style={styles.btnSolidText}>Guardar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 18 },
  title: { fontSize: 26, fontWeight: "900", marginTop: 10, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "800", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: { minHeight: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12, marginTop: 22 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 14, alignItems: "center" },
  btnGhost: { borderWidth: 1, borderColor: "#ddd" },
  btnGhostText: { fontWeight: "900", fontSize: 16 },
  btnSolid: { backgroundColor: "#111" },
  btnSolidText: { color: "#fff", fontWeight: "900", fontSize: 16 },
  photoBtn: { borderWidth: 1, borderColor: "#111", borderRadius: 14, paddingVertical: 12, alignItems: "center" },
  photoBtnText: { fontWeight: "900", fontSize: 16 },
  preview: { width: "100%", height: 220, borderRadius: 14, marginTop: 12, backgroundColor: "#eee" },
});