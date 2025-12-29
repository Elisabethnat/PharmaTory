import { useEffect, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, logoutUser, registerUser, startAuthListener } from "../../src/store/authSlice";
import { loadItems, syncPullFromFirebase, syncPushToFirebase } from "../../src/store/inventorySlice";

export default function SettingsScreen() {
  const dispatch = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const status = useSelector((s) => s.auth.status);
  const error = useSelector((s) => s.auth.error);

  const invError = useSelector((s) => s.inventory.error);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    dispatch(startAuthListener());
    dispatch(loadItems());
  }, [dispatch]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ajustes</Text>

      {!!invError && <Text style={styles.err}>{String(invError)}</Text>}

      {user ? (
        <>
          <Text style={styles.ok}>Logueado: {user.email}</Text>

          <Pressable style={styles.btn} onPress={() => dispatch(syncPullFromFirebase())}>
            <Text style={styles.btnText}>Traer de Firebase</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => dispatch(syncPushToFirebase())}>
            <Text style={styles.btnText}>Subir a Firebase</Text>
          </Pressable>

          <Pressable style={[styles.btn, styles.btnDanger]} onPress={() => dispatch(logoutUser())}>
            <Text style={[styles.btnText, { color: "#fff" }]}>Cerrar sesión</Text>
          </Pressable>
        </>
      ) : (
        <>
          <Text style={styles.label}>Email</Text>
          <TextInput value={email} onChangeText={setEmail} style={styles.input} autoCapitalize="none" />

          <Text style={styles.label}>Password</Text>
          <TextInput value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />

          {!!error && <Text style={styles.err}>{String(error)}</Text>}
          <Text style={styles.small}>Estado: {status}</Text>

          <Pressable style={styles.btn} onPress={() => dispatch(loginUser({ email, password }))}>
            <Text style={styles.btnText}>Login</Text>
          </Pressable>

          <Pressable style={styles.btn} onPress={() => dispatch(registerUser({ email, password }))}>
            <Text style={styles.btnText}>Registrarme</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 18 },
  title: { fontSize: 26, fontWeight: "900", marginTop: 10, marginBottom: 16 },
  ok: { fontSize: 16, fontWeight: "800", marginBottom: 14 },
  label: { fontSize: 16, fontWeight: "800", marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  btn: { marginTop: 12, borderWidth: 1, borderColor: "#111", borderRadius: 14, paddingVertical: 14, alignItems: "center" },
  btnText: { fontWeight: "900", fontSize: 16 },
  btnDanger: { backgroundColor: "#111" },
  err: { marginTop: 10, color: "crimson", fontWeight: "700" },
  small: { marginTop: 6, opacity: 0.6 },
});