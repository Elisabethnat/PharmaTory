# PharmaTory App

App mobile tipo ecommerce/inventario (farmacia) hecha con React Native + Expo Router.
Permite gestionar productos con persistencia offline (SQLite) y sincronización con Firebase.

## Funcionalidades
- Listado de productos (FlatList)
- Alta / edición / borrado (modal)
- Foto de producto (Cámara con Expo Image Picker)
- Persistencia local offline con SQLite
- Autenticación con Firebase Auth (Email/Password)
- Sincronización con Firebase Realtime Database (subir / traer)

## Tecnologías usadas
- Expo + React Native
- Expo Router (navegación)
- Redux Toolkit (manejo de estado)
- Expo SQLite (persistencia offline)
- Firebase (Auth + Realtime Database)
- Expo Image Picker (cámara)

### Uso

En la pestaña Home se ve el inventario.
Botón + Agregar abre el modal para crear un producto.
En el modal se puede:

cargar nombre, stock, nota, sacar una foto (cámara)

# Confirmación al borrar
Se utiliza Alert.alert() para pedir confirmación al usuario antes de eliminar un producto, mejorando la experiencia y evitando errores involuntarios.

En Ajustes:

Registrar/Login con email y contraseña,
Subir a Firebase / Traer de Firebase (cuando el usuario está logueado)

Firebase

Se usa Firebase Auth (Email/Password).
Se usa Realtime Database para guardar el inventario por usuario.

Persistencia offline (SQLite)

Los productos se guardan en la DB local pharmatory.db.

Nota
En desarrollo se puede usar npx expo start -c si hay cache viejo.
