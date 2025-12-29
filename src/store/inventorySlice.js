import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { get, ref, set } from "firebase/database";
import {
  deleteItemDb,
  getItems,
  replaceAllItemsDb,
  upsertItemDb,
} from "../db/sqlite";
import { rtdb } from "../firebaseConfig";

export const loadItems = createAsyncThunk("inventory/loadItems", async () => {
  return await getItems();
});

export const upsertItem = createAsyncThunk("inventory/upsertItem", async (item) => {
  await upsertItemDb(item);
  return await getItems();
});

export const deleteItem = createAsyncThunk("inventory/deleteItem", async (id) => {
  await deleteItemDb(id);
  return await getItems();
});

// Subir items a Firebase 
export const pushToFirebase = createAsyncThunk(
  "inventory/pushToFirebase",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const uid = state.auth?.user?.uid;
      if (!uid) return rejectWithValue("No hay usuario logueado.");

      const items = state.inventory?.items || [];
      await set(ref(rtdb, `users/${uid}/items`), items);
      return true;
    } catch (e) {
      return rejectWithValue(String(e?.message || e));
    }
  }
);

// Traer items desde Firebase y reemplazar local
export const pullFromFirebase = createAsyncThunk(
  "inventory/pullFromFirebase",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState();
      const uid = state.auth?.user?.uid;
      if (!uid) return rejectWithValue("No hay usuario logueado.");

      const snap = await get(ref(rtdb, `users/${uid}/items`));
      const remote = snap.exists() ? snap.val() : [];
      const items = Array.isArray(remote) ? remote : Object.values(remote || {});

      await replaceAllItemsDb(items);
      return await getItems();
    } catch (e) {
      return rejectWithValue(String(e?.message || e));
    }
  }
);

const inventorySlice = createSlice({
  name: "inventory",
  initialState: { items: [], syncStatus: "idle", syncError: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadItems.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(upsertItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(pushToFirebase.pending, (s) => {
        s.syncStatus = "loading";
        s.syncError = null;
      })
      .addCase(pushToFirebase.fulfilled, (s) => {
        s.syncStatus = "succeeded";
      })
      .addCase(pushToFirebase.rejected, (s, a) => {
        s.syncStatus = "failed";
        s.syncError = a.payload || "Error";
      })
      .addCase(pullFromFirebase.pending, (s) => {
        s.syncStatus = "loading";
        s.syncError = null;
      })
      .addCase(pullFromFirebase.fulfilled, (s, a) => {
        s.syncStatus = "succeeded";
        s.items = a.payload;
      })
      .addCase(pullFromFirebase.rejected, (s, a) => {
        s.syncStatus = "failed";
        s.syncError = a.payload || "Error";
      });
  },
});

export default inventorySlice.reducer;