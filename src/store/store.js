import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import inventoryReducer from "./inventorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
  },
});