# Manual del Programador - TechStore

## 1. Introducción

Este documento describe la arquitectura técnica, estructura de datos y endpoints de la API REST de TechStore, un sistema de e-commerce full-stack para la venta de productos tecnológicos.

**Stack tecnológico:**
- Backend: Node.js + Express.js
- Base de datos: MongoDB
- Frontend: HTML5 + CSS3 + JavaScript (vanilla)
- Autenticación: JWT (JSON Web Tokens)

---

## 2. Arquitectura del Sistema

### Diagrama de Flujo

```
┌─────────────────────┐
│   CLIENTE (Browser) │
│  Frontend HTML/CSS  │
│   JavaScript        │
└──────────┬──────────┘
           │
           │ HTTP/JSON
           │
┌──────────▼──────────────────────┐
│     Backend Express.js           │
│  ┌──────────────────────────┐   │
│  │  Routes & Controllers    │   │
│  │  - Auth (Login)          │   │
│  │  - Productos (CRUD)      │   │
│  │  - Checkout              │   │
│  └──────────────────────────┘   │
│  ┌──────────────────────────┐   │
│  │  Middleware              │   │
│  │  - JWT Auth              │   │
│  │  - CORS                  │   │
│  │  - JSON Parser           │   │
│  └──────────────────────────┘   │
└──────────┬──────────────────────┘
           │
           │ Mongoose ODM
           │
┌──────────▼──────────────────────┐
│    MongoDB (Base de Datos)       │
│  ┌────────────────┐              │
│  │ Colecciones:   │              │
│  │ - productos    │              │
│  │ - admins       │              │
│  └────────────────┘              │
└──────────────────────────────────┘
```

### Separación de Capas

**Frontend (Cliente):**
- Presentación de catálogo de productos
- Interacción del usuario (carrito, búsqueda)
- Panel administrativo
- Almacenamiento local (localStorage) para carrito

**Backend (Servidor):**
- Lógica de negocio (CRUD de productos)
- Validaciones de datos
- Autenticación y autorización
- Gestión de stock
- Comunicación con BD

**Base de Datos:**
- Persistencia de datos
- Índices para búsqueda rápida

---

## 3. Modelo de Datos

### Colección: `productos`

```javascript
{
  _id: ObjectId,
  nombre: String (requerido, trimmed),
  descripcion: String (requerido),
  precio: Number (requerido, >= 0),
  stock: Number (requerido, >= 0),
  categoria: String (requerido),
  imagen: String (default: ""),
  minimoStock: Number (default: 0),
  activo: Boolean (default: true),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

**Ejemplo:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Laptop ASUS VivoBook 15",
  "descripcion": "Laptop de alto rendimiento con procesador Intel i7",
  "precio": 1299999,
  "stock": 8,
  "categoria": "Computadoras",
  "imagen": "https://example.com/laptop.jpg",
  "minimoStock": 2,
  "activo": true,
  "createdAt": "2026-06-08T22:22:19.795Z",
  "updatedAt": "2026-06-08T22:22:19.795Z"
}
```

### Colección: `admins`

```javascript
{
  _id: ObjectId,
  username: String (requerido, único),
  password: String (requerido, hasheado con bcryptjs),
  role: String (default: "admin"),
  createdAt: Date (automático),
  updatedAt: Date (automático)
}
```

---

## 4. Autenticación y Autorización

### Flujo de Autenticación JWT

1. Admin envía credenciales (username, password) a `POST /api/auth/login`
2. Backend verifica credenciales contra BD
3. Si son válidas, genera JWT con payload `{ id, username, role }`
4. Token tiene duración de 8 horas
5. Cliente almacena token en localStorage
6. Token se envía en header `Authorization: Bearer <token>` en futuras peticiones
7. Middleware `protegerRuta` valida token en rutas protegidas

**Rutas públicas:** GET de productos, checkout
**Rutas protegidas:** CRUD de productos, dashboard, stock bajo

---

## 5. Documentación de Endpoints API

### Base URL: `http://localhost:3000/api`

### 5.1 Autenticación

#### POST `/auth/login`
Autentica un administrador y retorna JWT.

**Request:**
```json
{
  "username": "techstore_admin",
  "password": "techstore_admin123"
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMjczZmVkOTQ4NGEwNDNiYjQ4ZmMwMSIsInVzZXJuYW1lIjoidGVjaHN0b3JlX2FkbWluIiwicm9sZSI6ImFkbWluIn0.xxx"
}
```

**Errors:**
- `400`: Username o password faltantes
- `401`: Credenciales inválidas

---

### 5.2 Productos (Público)

#### GET `/productos?categoria=&q=&page=&limit=`
Obtiene listado de productos con filtros y paginación.

**Query Parameters:**
- `categoria` (string, opcional): filtrar por categoría
- `q` (string, opcional): búsqueda por nombre/descripción (case-insensitive)
- `page` (number, default: 1): número de página
- `limit` (number, default: 10): items por página
- `activo` (boolean, opcional): filtrar por estado

**Response (200):**
```json
{
  "total": 8,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Laptop ASUS VivoBook 15",
      "precio": 1299999,
      "stock": 8,
      "categoria": "Computadoras",
      ...
    }
  ]
}
```

**Ejemplo:**
```bash
GET /productos?categoria=Audio&q=sony&page=1&limit=5
```

---

#### GET `/productos/:id`
Obtiene detalles de un producto específico.

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Laptop ASUS VivoBook 15",
  "descripcion": "Laptop de alto rendimiento...",
  "precio": 1299999,
  "stock": 8,
  "categoria": "Computadoras",
  ...
}
```

**Errors:**
- `404`: Producto no encontrado

---

### 5.3 Carrito (Público)

#### POST `/productos/carrito/checkout`
Simula una compra, decrementa stock de forma atómica.

**Request:**
```json
{
  "items": [
    { "productId": "507f1f77bcf86cd799439011", "cantidad": 2 },
    { "productId": "507f1f77bcf86cd799439012", "cantidad": 1 }
  ]
}
```

**Response (200):**
```json
{
  "mensaje": "Compra simulada exitosa",
  "resumen": [
    {
      "id": "507f1f77bcf86cd799439011",
      "nombre": "Laptop ASUS VivoBook 15",
      "cantidad": 2,
      "stockRestante": 6
    }
  ]
}
```

**Errors:**
- `400`: Items inválidos
- `409`: Stock insuficiente para algún producto (se revierte todo)

---

### 5.4 Productos (Admin - Protegido)

**Header requerido:**
```
Authorization: Bearer <jwt_token>
```

#### POST `/productos`
Crea un nuevo producto.

**Request:**
```json
{
  "nombre": "Auriculares Sony WH-1000XM5",
  "descripcion": "Auriculares con cancelación activa de ruido",
  "precio": 449999,
  "stock": 15,
  "categoria": "Audio",
  "minimoStock": 3,
  "imagen": "https://example.com/sony.jpg",
  "activo": true
}
```

**Response (201):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "nombre": "Auriculares Sony WH-1000XM5",
  ...
}
```

**Errors:**
- `400`: Campos obligatorios faltantes
- `401`: Token no proporcionado o inválido

---

#### PUT `/productos/:id`
Actualiza un producto existente.

**Request:**
```json
{
  "precio": 429999,
  "stock": 20
}
```

**Response (200):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "precio": 429999,
  "stock": 20,
  ...
}
```

**Errors:**
- `404`: Producto no encontrado
- `401`: No autorizado

---

#### DELETE `/productos/:id`
Elimina un producto.

**Response (200):**
```json
{
  "mensaje": "Producto eliminado"
}
```

**Errors:**
- `404`: Producto no encontrado
- `401`: No autorizado

---

### 5.5 Dashboard (Admin - Protegido)

#### GET `/productos/dashboard`
Retorna métricas del inventario.

**Response (200):**
```json
{
  "totalProductos": 8,
  "activos": 7,
  "countStockBajo": 2,
  "productosStockBajo": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "nombre": "Monitor LG 27 inch 144Hz",
      "stock": 3,
      "minimoStock": 2
    },
    {
      "_id": "507f1f77bcf86cd799439014",
      "nombre": "Mousepad SteelSeries QcK",
      "stock": 1,
      "minimoStock": 5
    }
  ]
}
```

---

#### GET `/productos/stock-bajo`
Obtiene productos con stock <= minimoStock.

**Response (200):**
```json
{
  "total": 2,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "nombre": "Mousepad SteelSeries QcK",
      "stock": 1,
      "minimoStock": 5
    }
  ]
}
```

---

## 6. Códigos de Estado HTTP

| Código | Significado | Ejemplo |
|--------|-------------|---------|
| 200    | OK - Éxito  | GET producto exitoso |
| 201    | Created - Recurso creado | POST producto |
| 400    | Bad Request - Datos inválidos | Falta campo requerido |
| 401    | Unauthorized - Sin autenticación | Token inválido/faltante |
| 403    | Forbidden - Sin permisos | No se necesita en este proyecto |
| 404    | Not Found - Recurso no existe | GET de producto inexistente |
| 409    | Conflict - Conflicto de datos | Stock insuficiente en checkout |
| 500    | Server Error - Error del servidor | Error de BD |

---

## 7. Validaciones y Seguridad

### Validaciones en Backend

- **Campos requeridos:** nombre, descripción, precio, stock, categoría
- **Tipos de datos:** precio >= 0, stock >= 0 (enteros)
- **Búsqueda SQL injection prevention:** Regex con `$regex` de Mongoose (seguro)
- **Contraseñas:** Hasheadas con bcryptjs (salt: 10 rounds)
- **JWT:** Verificado en cada ruta protegida

### Medidas de Seguridad

1. **JWT para admin:** Token con expiración de 8 horas
2. **CORS habilitado:** Para permitir frontend desde localhost
3. **.env para credenciales:** No subir `.env` al repositorio
4. **Validación de entrada:** Campos requeridos y tipos
5. **Manejo de errores:** Mensajes claros sin exponer detalles internos

### Operaciones Atómicas

**Checkout:**
- Se decrementa stock **solo si hay suficiente** (operación `$gte` en BD)
- Si algún item falla, se revierte (rollback) el stock de items anteriores
- Evita condiciones de carrera en ventas simultáneas

---

## 8. Instalación y Despliegue Local

### Requisitos
- Node.js 18+
- MongoDB community o conexión a MongoDB Atlas
- npm

### Pasos

1. **Clonar/Extraer repositorio**
   ```bash
   cd D:\Desktop\Documentos\TechStore\backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   copy .env.example .env
   # Editar .env y establecer MONGODB_URI
   ```

4. **Crear usuario admin**
   ```bash
   npm run seed-admin
   ```

5. **Crear productos de prueba (opcional)**
   ```bash
   npm run seed-productos
   ```

6. **Iniciar servidor en desarrollo**
   ```bash
   npm run dev
   # O en producción:
   npm start
   ```

7. **Verificar**
   ```
   http://localhost:3000/ → Debe devolver "TechStore API funcionando"
   ```

---

## 9. Frontend - Estructura de Archivos

```
frontend/
├── index.html           # Catálogo público
├── detalle.html         # Detalle de producto
├── carrito.html         # Carrito y checkout
├── admin-login.html     # Login para admin
├── admin.html           # Panel administrativo
├── styles.css           # Estilos globales
└── js/
    ├── api.js           # Cliente API (TechStoreAPI class)
    ├── carrito.js       # Gestor del carrito (localStorage)
    ├── catalogo.js      # Lógica de página de catálogo
    ├── detalle.js       # Lógica de página de detalle
    ├── carrito-page.js  # Lógica de página de carrito
    ├── admin-login.js   # Lógica de login admin
    └── admin-panel.js   # Lógica de panel admin (CRUD)
```

### Flujo Frontend

1. **index.html** → Carga productos públicos con filtros y paginación
2. **detalle.html** → Muestra información completa de producto seleccionado
3. **carrito.html** → Gestiona carrito (localStorage) y simula checkout
4. **admin-login.html** → Autentica admin y obtiene JWT
5. **admin.html** → CRUD de productos y dashboard con métricas

---

## 10. Variables de Entorno (.env)

```dotenv
PORT=3000
MONGODB_URI=mongodb://localhost:27017/techstore
# O para MongoDB Atlas:
# MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/techstore?retryWrites=true&w=majority

# Opcional (generado automáticamente si no se define):
JWT_SECRET=secretkey
```

---

## 11. Consideraciones de Despliegue en Producción

1. **Usar variables de entorno en hosting** (Render, Railway, etc.)
2. **Cambiar JWT_SECRET a un valor seguro** (generar con openssl)
3. **Usar HTTPS** en producción
4. **Configurar CORS correctamente** con dominio del frontend
5. **Usar MongoDB Atlas** en lugar de local
6. **Agregar rate limiting** (express-rate-limit)
7. **Implementar compresión** (compression middleware)
8. **Logs y monitoreo** (winston, Sentry)

---

## 12. Testing Manual con Postman/Insomnia

### 1. Login
```
POST http://localhost:3000/api/auth/login
Body (JSON):
{
  "username": "techstore_admin",
  "password": "techstore_admin123"
}
```
Guardar token en variable de entorno.

### 2. Crear Producto
```
POST http://localhost:3000/api/productos
Headers: Authorization: Bearer {{token}}
Body (JSON):
{
  "nombre": "Test Producto",
  "descripcion": "Descripción test",
  "precio": 99999,
  "stock": 10,
  "categoria": "Audio",
  "minimoStock": 2
}
```

### 3. Listar Productos
```
GET http://localhost:3000/api/productos?categoria=Audio&page=1&limit=5
```

### 4. Checkout (sin auth)
```
POST http://localhost:3000/api/productos/carrito/checkout
Body (JSON):
{
  "items": [
    { "productId": "{{product_id}}", "cantidad": 2 }
  ]
}
```

---

## 13. Fichas Técnicas de Dependencias

| Dependencia | Versión | Propósito |
|-------------|---------|-----------|
| express | ^5.2.1 | Framework web |
| mongoose | ^8.24.0 | ODM para MongoDB |
| jsonwebtoken | ^9.0.2 | Autenticación JWT |
| bcryptjs | ^2.4.3 | Hash de contraseñas |
| cors | ^2.8.6 | CORS middleware |
| dotenv | ^17.4.2 | Variables de entorno |
| nodemon | ^3.1.14 | Dev server con reload |

---

## 14. Troubleshooting

| Problema | Causa | Solución |
|----------|-------|----------|
| Error conexión MongoDB | MongoDB no activo/URI inválida | Verificar MongoDB running y `.env` |
| Token inválido | JWT expirado | Re-loguear admin |
| Stock insuficiente en checkout | Cantidad > disponible | Validar stock en frontend |
| CORS error | Frontend y backend en puertos diferentes | Verificar CORS config en server.js |
| Productos no cargando | Error en API | Verificar console.log del backend |

---

## 15. Próximas Mejoras Sugeridas

1. Implementar paginación en admin (actualmente carga todos)
2. Subida de imágenes con multer (en lugar de URLs)
3. Tests automáticos (jest + supertest)
4. Roles y permisos granulares
5. Historial de cambios en productos
6. Sistema de órdenes real (no solo simulado)
7. Notificaciones por email
8. Analytics y reportes

---

**Autor:** Manolo Pajaro Borras  
**Fecha:** Junio 2026  
**Versión:** 1.0

