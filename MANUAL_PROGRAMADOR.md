# Manual del Programador - TechStore

## 1. Introducción

Este documento describe la arquitectura técnica, modelo de datos, endpoints de la API y procedimientos de instalación y despliegue de **TechStore**, un sistema de e-commerce full-stack para la venta de productos tecnológicos.

### URLs del Proyecto

| Recurso | URL |
|---|---|
| **Frontend (producción)** | https://techstore-yorleyner.netlify.app |
| **Backend (producción)** | https://techstore-backend-i9kh.onrender.com |
| **Repositorio GitHub** | https://github.com/yorleynermc/TechStore |

### Stack Tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Frontend | HTML5 + CSS3 + JavaScript vanilla | — |
| Backend | Node.js + Express.js | Node ≥ 18, Express ^5.2.1 |
| Base de datos | MongoDB Atlas (cloud) | Mongoose ^8.24.0 |
| Autenticación | JWT (JSON Web Tokens) | jsonwebtoken ^9.0.2 |
| Cifrado | bcryptjs | ^2.4.3 |
| Hosting frontend | Netlify (CDN estático) | — |
| Hosting backend | Render (servicio web Node.js) | — |

---

## 2. Arquitectura del Sistema

### Diagrama de Producción

```
┌──────────────────────────────────────────┐
│         CLIENTE (Navegador Web)           │
│   HTML5 + CSS3 + JavaScript vanilla       │
│   Servido desde Netlify CDN               │
└────────────┬─────────────────────────────┘
             │
             │ HTTPS  (/api/*)
             │ Netlify reescribe la ruta:
             │ /api/* → https://techstore-backend-i9kh.onrender.com/api/*
             │
┌────────────▼─────────────────────────────┐
│         BACKEND  (Render)                 │
│   Node.js + Express.js                   │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Rutas                             │  │
│  │  POST  /api/auth/login             │  │
│  │  GET   /api/productos              │  │
│  │  GET   /api/productos/:id          │  │
│  │  POST  /api/productos/carrito/...  │  │
│  │  GET   /api/productos/dashboard    │  │
│  │  GET   /api/productos/stock-bajo   │  │
│  │  POST  /api/productos              │  │
│  │  PUT   /api/productos/:id          │  │
│  │  DELETE /api/productos/:id         │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │  Middleware                        │  │
│  │  - CORS (abierto)                  │  │
│  │  - JSON Parser (límite 5 MB)       │  │
│  │  - JWT Auth (rutas protegidas)     │  │
│  └────────────────────────────────────┘  │
└────────────┬─────────────────────────────┘
             │
             │ Mongoose ODM (TLS)
             │
┌────────────▼─────────────────────────────┐
│         MongoDB Atlas (Cloud)             │
│   Colecciones:                           │
│   - productos                            │
│   - admins                               │
└──────────────────────────────────────────┘
```

### Flujo de Proxy en Producción

El frontend está alojado en Netlify como un sitio estático. Todas las peticiones al path `/api/*` son interceptadas por Netlify y redirigidas al backend en Render mediante un proxy definido en `netlify.toml`:

```toml
[[redirects]]
  from   = "/api/*"
  to     = "https://techstore-backend-i9kh.onrender.com/api/:splat"
  status = 200
  force  = true
```

Esto elimina problemas de CORS en producción: desde el punto de vista del navegador, el frontend y la API están en el mismo dominio (`techstore-yorleyner.netlify.app`).

### Separación de Capas

**Frontend (Cliente — Netlify):**
- Presentación del catálogo de productos (index.html)
- Vista de detalle de producto (detalle.html)
- Carrito de compras con persistencia en localStorage (carrito.html)
- Panel administrativo con CRUD de productos (admin.html)
- Autenticación: token JWT almacenado en `localStorage` bajo la clave `adminToken`

**Backend (Servidor — Render):**
- Lógica de negocio: CRUD de productos
- Autenticación y autorización con JWT
- Validaciones de datos
- Gestión de stock con operaciones atómicas
- Comunicación con MongoDB Atlas

**Base de Datos (MongoDB Atlas):**
- Persistencia de productos y administradores
- Búsqueda full-text con expresiones regulares vía Mongoose

---

## 3. Estructura de Carpetas

```
TechStore/
├── frontend/                    # Archivos estáticos servidos por Netlify
│   ├── index.html               # Catálogo público con filtros y paginación
│   ├── detalle.html             # Detalle de producto individual
│   ├── carrito.html             # Carrito de compras y checkout simulado
│   ├── admin-login.html         # Formulario de autenticación admin
│   ├── admin.html               # Panel administrativo (CRUD + dashboard)
│   ├── styles.css               # Estilos globales
│   └── js/
│       ├── api.js               # Clase TechStoreAPI (cliente HTTP centralizado)
│       ├── carrito.js           # Clase CarritoManager (persistencia localStorage)
│       ├── catalogo.js          # Lógica del catálogo: filtros, paginación, cards
│       ├── detalle.js           # Lógica de la página de detalle
│       ├── carrito-page.js      # Lógica de la página del carrito y checkout
│       ├── admin-login.js       # Lógica del formulario de login
│       └── admin-panel.js       # Lógica del panel admin: CRUD y dashboard
│
├── backend/                     # API REST servida por Render
│   ├── server.js                # Punto de entrada: Express, middleware, rutas
│   ├── package.json             # Dependencias y scripts npm
│   ├── .env.example             # Plantilla de variables de entorno
│   └── src/
│       ├── config/
│       │   └── database.js      # Conexión a MongoDB con Mongoose
│       ├── models/
│       │   ├── Producto.js      # Schema Mongoose del producto
│       │   └── Admin.js         # Schema Mongoose del administrador
│       ├── routes/
│       │   ├── authRoutes.js    # Ruta POST /auth/login
│       │   └── productoRoutes.js # Todas las rutas de /productos
│       ├── controllers/
│       │   ├── authController.js     # Lógica de login con JWT
│       │   └── productoController.js # Lógica CRUD, dashboard, checkout
│       └── middleware/
│           └── authMiddleware.js     # Verificación de token JWT
│
├── netlify.toml                 # Config de Netlify: directorio y regla de proxy
├── render.yaml                  # Config de Render: tipo, directorio raíz, scripts
├── MANUAL_USUARIO.md
└── MANUAL_PROGRAMADOR.md
```

---

## 4. Modelo de Datos

### Colección: `productos`

```javascript
{
  _id:         ObjectId,           // generado automáticamente
  nombre:      String,  required, trim
  descripcion: String,  required
  precio:      Number,  required, min: 0
  stock:       Number,  required, min: 0
  categoria:   String,  required   // "Audio" | "Celulares" | "Computadoras" | "Perifericos" | "Accesorios"
  imagen:      String,  default: ""
  minimoStock: Number,  default: 0, min: 0
  activo:      Boolean, default: true
  createdAt:   Date     // timestamps automáticos (Mongoose)
  updatedAt:   Date
}
```

**Documento de ejemplo:**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "nombre": "Laptop ASUS VivoBook 15",
  "descripcion": "Laptop de alto rendimiento con procesador Intel i7, 16GB RAM, 512GB SSD",
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
  _id:       ObjectId,
  username:  String,  required, unique
  password:  String,  required  // hash bcryptjs, 10 salt rounds
  role:      String,  default: "admin"
  createdAt: Date
  updatedAt: Date
}
```

---

## 5. Autenticación y Autorización

### Flujo JWT

1. El admin envía `POST /api/auth/login` con `{ username, password }`
2. El backend busca el usuario en MongoDB y compara la contraseña con `bcrypt.compare()`
3. Si es válida, firma un JWT con payload `{ id, username, role }` y expiración de 8 horas
4. El cliente guarda el token en `localStorage` con la clave `adminToken`
5. Cada petición a rutas protegidas incluye el header `Authorization: Bearer <token>`
6. El middleware `protegerRuta` verifica la firma, extrae el `id` y confirma que el admin aún existe en BD

### Rutas públicas vs. protegidas

| Tipo | Rutas |
|---|---|
| **Pública** | `GET /api/productos`, `GET /api/productos/:id`, `POST /api/productos/carrito/checkout` |
| **Protegida (admin)** | `POST /api/productos`, `PUT /api/productos/:id`, `DELETE /api/productos/:id`, `GET /api/productos/dashboard`, `GET /api/productos/stock-bajo` |

### Persistencia de sesión en el frontend

El token se almacena en `localStorage['adminToken']`. Al cargar `admin.html`, el script verifica su presencia antes de renderizar el panel. Si no existe, redirige a `admin-login.html`. Al cargar `admin-login.html`, si el token ya existe, redirige directamente a `admin.html` sin mostrar el formulario.

---

## 6. Documentación de Endpoints API

### Base URL (producción): `https://techstore-backend-i9kh.onrender.com/api`
### Base URL (local): `http://localhost:3000/api`

---

### 6.1 Autenticación

#### `POST /auth/login`
Autentica al administrador y retorna un JWT de 8 horas.

**Request:**
```json
{
  "username": "techstore_admin",
  "password": "techstore_admin123"
}
```

**Response `200`:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Errores:**
- `400` — Username o password faltantes
- `401` — Credenciales inválidas

---

### 6.2 Productos — Rutas públicas

#### `GET /productos`
Listado paginado de productos con filtros opcionales.

**Query parameters:**

| Parámetro | Tipo | Default | Descripción |
|---|---|---|---|
| `categoria` | string | — | Filtrar por categoría exacta |
| `q` | string | — | Búsqueda en nombre y descripción (case-insensitive) |
| `page` | number | 1 | Número de página |
| `limit` | number | 10 | Resultados por página |
| `activo` | boolean | — | Filtrar por estado activo/inactivo |

**Response `200`:**
```json
{
  "total": 9,
  "page": 1,
  "limit": 10,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "nombre": "Laptop ASUS VivoBook 15",
      "descripcion": "Laptop de alto rendimiento...",
      "precio": 1299999,
      "stock": 8,
      "categoria": "Computadoras",
      "imagen": "https://example.com/laptop.jpg",
      "minimoStock": 2,
      "activo": true,
      "createdAt": "2026-06-08T22:22:19.795Z",
      "updatedAt": "2026-06-08T22:22:19.795Z"
    }
  ]
}
```

**Ejemplo:**
```
GET /productos?categoria=Audio&q=sony&page=1&limit=5
```

---

#### `GET /productos/:id`
Detalle completo de un producto por su ObjectId.

**Response `200`:** objeto producto completo (mismo esquema que los items del listado)

**Errores:**
- `404` — Producto no encontrado

---

#### `POST /productos/carrito/checkout`
Simula una compra. Decrementa el stock de cada item de forma atómica. Si algún item falla por stock insuficiente, se revierte (rollback) el stock de los items ya procesados.

**Request:**
```json
{
  "items": [
    { "productId": "507f1f77bcf86cd799439011", "cantidad": 2 },
    { "productId": "507f1f77bcf86cd799439012", "cantidad": 1 }
  ]
}
```

**Response `200`:**
```json
{
  "mensaje": "Compra simulada exitosa",
  "resumen": [
    { "id": "507f1f77bcf86cd799439011", "nombre": "Laptop ASUS VivoBook 15", "cantidad": 2, "stockRestante": 6 },
    { "id": "507f1f77bcf86cd799439012", "nombre": "Mouse Logitech MX Master 3", "cantidad": 1, "stockRestante": 11 }
  ]
}
```

**Errores:**
- `400` — Items vacíos o datos inválidos
- `409` — Stock insuficiente para algún producto (todo el checkout se revierte)

---

### 6.3 Productos — Rutas protegidas (admin)

Todas requieren el header:
```
Authorization: Bearer <jwt_token>
```

---

#### `POST /productos`
Crea un nuevo producto.

**Request:**
```json
{
  "nombre": "Samsung Galaxy A55",
  "descripcion": "Pantalla AMOLED 6.6\", cámara 50MP, batería 5000mAh",
  "precio": 1199000,
  "stock": 10,
  "categoria": "Celulares",
  "minimoStock": 2,
  "imagen": "https://example.com/galaxy-a55.jpg",
  "activo": true
}
```

**Response `201`:** objeto producto creado completo

**Errores:**
- `400` — Campos obligatorios faltantes o validación de schema fallida
- `401` — Token no proporcionado o inválido

---

#### `PUT /productos/:id`
Actualiza uno o más campos de un producto. Solo se envían los campos a modificar.

**Request (parcial):**
```json
{
  "precio": 1099000,
  "stock": 15
}
```

**Response `200`:** objeto producto actualizado completo

**Errores:**
- `400` — Validación fallida
- `401` — No autorizado
- `404` — Producto no encontrado

---

#### `DELETE /productos/:id`
Elimina permanentemente un producto.

**Response `200`:**
```json
{ "mensaje": "Producto eliminado" }
```

**Errores:**
- `401` — No autorizado
- `404` — Producto no encontrado

---

#### `GET /productos/dashboard`
Retorna métricas generales del inventario.

**Response `200`:**
```json
{
  "totalProductos": 9,
  "activos": 8,
  "countStockBajo": 2,
  "productosStockBajo": [
    { "_id": "...", "nombre": "Mousepad SteelSeries QcK", "stock": 1, "minimoStock": 5 },
    { "_id": "...", "nombre": "Webcam Logitech 4K Pro",   "stock": 0, "minimoStock": 2 }
  ]
}
```

> Un producto aparece en `productosStockBajo` cuando `stock <= minimoStock`.

---

#### `GET /productos/stock-bajo`
Listado completo de productos con stock por debajo del mínimo.

**Response `200`:**
```json
{
  "total": 2,
  "data": [
    { "_id": "...", "nombre": "Mousepad SteelSeries QcK", "stock": 1, "minimoStock": 5, ... }
  ]
}
```

---

## 7. Códigos de Estado HTTP

| Código | Significado | Cuándo ocurre |
|---|---|---|
| `200` | OK | Petición exitosa (GET, PUT, DELETE, checkout, login) |
| `201` | Created | Producto creado exitosamente (POST /productos) |
| `400` | Bad Request | Datos inválidos o campos requeridos faltantes |
| `401` | Unauthorized | Token ausente, inválido o expirado |
| `404` | Not Found | Producto no encontrado por ID |
| `409` | Conflict | Stock insuficiente durante checkout |
| `500` | Server Error | Error interno del servidor o de conexión a BD |

---

## 8. Instalación y Despliegue Local

### Requisitos previos

- Node.js 18 o superior
- Acceso a MongoDB Atlas (o instancia local de MongoDB)
- npm

### Pasos

**1. Clonar el repositorio**
```bash
git clone https://github.com/yorleynermc/TechStore.git
cd TechStore
```

**2. Instalar dependencias del backend**
```bash
cd backend
npm install
```

**3. Configurar variables de entorno**
```bash
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Edita `.env` con los valores correctos:
```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://techstore_admin:<password>@cluster0.mlcprrs.mongodb.net/techstore?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_segura
```

**4. Iniciar el servidor**
```bash
# Desarrollo (recarga automática)
npm run dev

# Producción
npm start
```

**7. Verificar**
```
GET http://localhost:3000/
→ "TechStore API funcionando"
```

**8. Abrir el frontend**

Abre directamente en el navegador el archivo `frontend/index.html`, o sirve la carpeta con un servidor estático:
```bash
# Con Node.js (sin instalación extra)
npx serve frontend

# Con Python
python -m http.server 8080 --directory frontend
```

> En local, `api.js` detecta `localhost` y apunta al backend en `http://localhost:3000/api` en lugar de usar el proxy de Netlify.

---

## 9. Variables de Entorno

| Variable | Descripción | Requerida |
|---|---|---|
| `MONGODB_URI` | URI de conexión a MongoDB Atlas | Sí |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT | Sí (default débil si se omite) |
| `PORT` | Puerto del servidor (default: 3000) | No |

> En Render, estas variables se configuran en el dashboard del servicio en **Environment → Add Environment Variable**.

---

## 10. Despliegue en Producción

### Frontend — Netlify

1. Conectar el repositorio de GitHub en Netlify
2. Configurar:
   - **Publish directory:** `frontend`
   - **Build command:** (vacío, es un sitio estático)
3. El archivo `netlify.toml` ya incluye la regla de proxy para `/api/*`
4. Netlify redespliega automáticamente en cada `git push` a `main`

### Backend — Render

1. Crear un servicio de tipo **Web Service** en Render
2. Conectar el repositorio de GitHub
3. Configurar:
   - **Root directory:** `backend`
   - **Build command:** `npm install`
   - **Start command:** `npm start`
4. Agregar las variables de entorno `MONGODB_URI` y `JWT_SECRET` en el dashboard de Render
5. El archivo `render.yaml` define estas opciones para despliegue como Infrastructure as Code

---

## 11. Testing Manual con Postman / Insomnia

### 1. Login (obtener token)
```
POST https://techstore-backend-i9kh.onrender.com/api/auth/login
Content-Type: application/json

{
  "username": "techstore_admin",
  "password": "techstore_admin123"
}
```
Guardar el `token` retornado en una variable de entorno de Postman/Insomnia.

### 2. Listar productos con filtros
```
GET https://techstore-backend-i9kh.onrender.com/api/productos?categoria=Audio&q=sony&page=1&limit=5
```

### 3. Obtener detalle de producto
```
GET https://techstore-backend-i9kh.onrender.com/api/productos/{{product_id}}
```

### 4. Crear producto (requiere token)
```
POST https://techstore-backend-i9kh.onrender.com/api/productos
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "nombre": "Auriculares Sony WH-1000XM5",
  "descripcion": "Cancelación activa de ruido, 30 horas de batería",
  "precio": 449999,
  "stock": 15,
  "categoria": "Audio",
  "minimoStock": 3,
  "activo": true
}
```

### 5. Checkout (sin autenticación)
```
POST https://techstore-backend-i9kh.onrender.com/api/productos/carrito/checkout
Content-Type: application/json

{
  "items": [
    { "productId": "{{product_id}}", "cantidad": 2 }
  ]
}
```

### 6. Dashboard (requiere token)
```
GET https://techstore-backend-i9kh.onrender.com/api/productos/dashboard
Authorization: Bearer {{token}}
```

---

## 12. Ficha Técnica de Dependencias

### Backend

| Dependencia | Versión | Propósito |
|---|---|---|
| express | ^5.2.1 | Framework web HTTP |
| mongoose | ^8.24.0 | ODM para MongoDB |
| jsonwebtoken | ^9.0.2 | Generación y verificación de JWT |
| bcryptjs | ^2.4.3 | Hash de contraseñas (salt: 10 rounds) |
| cors | ^2.8.6 | Middleware de CORS |
| dotenv | ^17.4.2 | Carga de variables de entorno desde `.env` |
| nodemon | ^3.1.14 | Recarga automática en desarrollo (devDependency) |

### Frontend

Sin dependencias externas. JavaScript vanilla puro con Fetch API nativa del navegador.

---

## 13. Validaciones y Seguridad

### Validaciones del backend

- **Campos requeridos:** `nombre`, `descripcion`, `precio`, `stock`, `categoria` validados antes de crear
- **Tipos y rangos:** `precio >= 0`, `stock >= 0` enforceados por el schema de Mongoose
- **Búsqueda segura:** `$regex` de Mongoose con `$options: 'i'` — no expuesto a inyección
- **Contraseñas:** nunca almacenadas en texto plano; hash con bcryptjs (10 salt rounds)
- **JWT:** verificado en cada petición a rutas protegidas; el middleware también confirma que el admin aún exista en BD (previene tokens huérfanos)

### Checkout atómico

```
Para cada item:
  Producto.findOneAndUpdate(
    { _id: productId, stock: { $gte: cantidad } },
    { $inc: { stock: -cantidad } }
  )
  → Si el resultado es null: stock insuficiente
    → Rollback: restaurar stock de todos los items ya procesados
    → Retornar 409 Conflict
```

Esta estrategia evita condiciones de carrera en ventas simultáneas sin necesidad de transacciones.

---

## 14. Troubleshooting

| Problema | Causa probable | Solución |
|---|---|---|
| Error de conexión a MongoDB | `MONGODB_URI` incorrecto o red bloqueada | Verificar variable de entorno; comprobar IP en MongoDB Atlas Network Access |
| `401 Unauthorized` al llamar rutas admin | Token expirado (8 h) o no enviado | Re-loguear; verificar que el header `Authorization` se incluya |
| `409 Conflict` en checkout | Stock insuficiente para uno o más items | Verificar stock en frontend antes de enviar; el backend revierte automáticamente |
| Productos no cargan en el catálogo | Backend en Render inactivo (cold start) | El primer request puede tardar ~30 s; volver a intentar |
| CORS error en desarrollo local | Frontend y backend en puertos distintos | El `cors()` en `server.js` está configurado sin restricciones; verificar que el backend esté corriendo |
| El panel admin redirige al login tras recargar | `localStorage` bloqueado o borrado | Verificar configuración de privacidad del navegador |

---

## 15. Próximas Mejoras Sugeridas

1. Paginación en el panel admin (actualmente carga hasta 100 productos)
2. Carga directa de imágenes con multer (actualmente solo URLs)
3. Tests automáticos con jest + supertest
4. Rate limiting en la API (express-rate-limit)
5. Sistema de órdenes real con historial de compras
6. Roles y permisos granulares (administrador / editor / solo lectura)
7. Notificaciones por email al detectar stock bajo
8. Compresión de respuestas con middleware `compression`

---

**Autor:** Yorleyner MC
**Fecha:** Junio 2026
**Versión:** 1.1
