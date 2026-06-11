# TechStore — Contexto del Proyecto

Proyecto académico final de Taller II de Programación (Politécnico Colombiano Jaime Isaza Cadavid).
E-commerce full-stack de productos tecnológicos, arquitectura Cliente-Servidor con frontend estático
y API REST separada.

---

## URLs de Producción

| Recurso | URL |
|---|---|
| Frontend (Netlify) | https://techstore-yorleyner.netlify.app |
| Backend (Render) | https://techstore-backend-i9kh.onrender.com |
| Repositorio GitHub | https://github.com/yorleynermc/TechStore |

---

## Stack Tecnológico

**Frontend:** HTML5 + CSS3 + JavaScript vanilla (sin frameworks ni bundlers)
**Backend:** Node.js 18+ + Express ^5.2.1
**Base de datos:** MongoDB Atlas (cloud) via Mongoose ^8.24.0
**Autenticación:** JWT (jsonwebtoken ^9.0.2) + bcryptjs ^2.4.3
**Hosting frontend:** Netlify (CDN estático, deploy automático desde `main`)
**Hosting backend:** Render (web service Node.js, deploy automático desde `main`)

---

## Estructura de Carpetas

```
TechStore/
├── frontend/
│   ├── index.html           # Catálogo público: filtros, búsqueda, paginación
│   ├── detalle.html         # Detalle de producto individual
│   ├── carrito.html         # Carrito de compras y checkout simulado
│   ├── admin-login.html     # Formulario de login admin
│   ├── admin.html           # Panel admin: CRUD de productos + dashboard
│   ├── styles.css           # Estilos globales
│   └── js/
│       ├── api.js           # Clase TechStoreAPI — cliente HTTP centralizado
│       ├── carrito.js       # Clase CarritoManager — persistencia localStorage
│       ├── catalogo.js      # Lógica del catálogo (filtros, paginación, cards)
│       ├── detalle.js       # Lógica de página de detalle
│       ├── carrito-page.js  # Lógica del carrito y checkout
│       ├── admin-login.js   # Lógica del login admin
│       └── admin-panel.js   # Lógica del panel admin (CRUD + dashboard)
│
├── backend/
│   ├── server.js            # Entry point: Express, middleware, rutas
│   ├── package.json
│   ├── .env.example         # Plantilla de variables de entorno
│   ├── seedAdmin.js         # Script utilitario: crea admin inicial en BD
│   ├── seedProductos.js     # Script utilitario: pobla productos de prueba
│   └── src/
│       ├── config/database.js
│       ├── models/Producto.js
│       ├── models/Admin.js
│       ├── routes/authRoutes.js
│       ├── routes/productoRoutes.js
│       ├── controllers/authController.js
│       ├── controllers/productoController.js
│       └── middleware/authMiddleware.js
│
├── netlify.toml             # Publish dir + regla de proxy /api/* → Render
├── render.yaml              # Config de despliegue del backend en Render
├── CLAUDE.md                # Este archivo
├── MANUAL_USUARIO.md
└── MANUAL_PROGRAMADOR.md
```

---

## Variables de Entorno del Backend

Archivo: `backend/.env` (no subir a git — ya está en `.gitignore`)

```dotenv
PORT=3000
MONGODB_URI=mongodb+srv://techstore_admin:<password>@cluster0.mlcprrs.mongodb.net/techstore?retryWrites=true&w=majority
JWT_SECRET=una_clave_secreta_segura
```

En Render estas variables se configuran en el dashboard del servicio.

---

## Credenciales de Prueba

```
Admin panel:  techstore_admin / techstore_admin123
MongoDB user: techstore_admin / (ver .env)
```

---

## Cómo Funciona el Proxy en Producción

`netlify.toml` redirige todas las peticiones `/api/*` al backend en Render:

```toml
[[redirects]]
  from   = "/api/*"
  to     = "https://techstore-backend-i9kh.onrender.com/api/:splat"
  status = 200
  force  = true
```

Por eso en `api.js` la base URL es `/api` en producción — el navegador ve el mismo dominio
y nunca hay error de CORS. Solo en `localhost` se apunta directamente al backend:

```javascript
const API_BASE_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:3000/api'
    : '/api';
```

---

## Autenticación Admin

- Token JWT almacenado en `localStorage` bajo la clave **`adminToken`** (no `admin_token`)
- Al cargar `admin-login.html`: si ya existe `adminToken` → redirige directo a `admin.html`
- Al cargar `admin.html`: si no existe `adminToken` → redirige a `admin-login.html`
- El token expira a las 8 horas
- "Cerrar sesión" llama a `api.logout()` que elimina `adminToken` de `localStorage`

---

## Modelo de Datos

### Producto
```
nombre       String  required
descripcion  String  required
precio       Number  required, >= 0
stock        Number  required, >= 0
categoria    String  required  → "Audio" | "Celulares" | "Computadoras" | "Perifericos" | "Accesorios"
imagen       String  default: ""
minimoStock  Number  default: 0  → alerta cuando stock <= minimoStock
activo       Boolean default: true
createdAt / updatedAt  automáticos (timestamps)
```

### Admin
```
username  String  required, unique
password  String  required (hash bcrypt, 10 rounds)
role      String  default: "admin"
```

---

## Endpoints de la API

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/login` | No | Login admin, retorna JWT |
| GET | `/api/productos` | No | Listado con filtros y paginación |
| GET | `/api/productos/:id` | No | Detalle de producto |
| POST | `/api/productos/carrito/checkout` | No | Checkout atómico simulado |
| GET | `/api/productos/dashboard` | Sí | Métricas del inventario |
| GET | `/api/productos/stock-bajo` | Sí | Productos con stock <= minimoStock |
| POST | `/api/productos` | Sí | Crear producto |
| PUT | `/api/productos/:id` | Sí | Actualizar producto |
| DELETE | `/api/productos/:id` | Sí | Eliminar producto |

**Rutas protegidas:** requieren header `Authorization: Bearer <token>`

---

## Patrón: productosCache

`catalogo.js` y `admin-panel.js` usan un objeto `productosCache` en memoria para evitar
inyectar datos de producto directamente en atributos `onclick` (los nombres/descripciones
pueden contener comillas que rompen el JS). Solo se pasa el `_id` al onclick; los datos
se recuperan del cache:

```javascript
let productosCache = {};
// Al renderizar:
productos.forEach(p => { productosCache[p._id] = p; });
// En el HTML generado:
onclick="editProducto('${p._id}')"
// En la función:
function editProducto(id) { const p = productosCache[id]; ... }
```

---

## Bugs Corregidos

1. **Inyección de datos en onclick** (`catalogo.js`, `admin-panel.js`): nombres y descripciones
   con comillas simples rompían el JS. Fix: patrón `productosCache` (pasar solo `_id`).

2. **Clave localStorage incorrecta**: se renombró de `admin_token` a `adminToken` en `api.js`
   para consistencia con los checks explícitos en `admin-panel.js` y `admin-login.js`.

3. **Link "Admin" apuntaba a `admin-login.html`**: en `index.html`, `carrito.html` y
   `detalle.html` se cambió a `admin.html` — el guard del panel decide si hay sesión o
   redirige al login.

4. **Sesión admin no persistía al navegar**: `admin-login.js` ahora verifica si ya existe
   `adminToken` al cargar y redirige directo a `admin.html` sin mostrar el formulario.

5. **Superposición en carrito vacío**: `.carrito-vacio` cambió a `display: flex;
   flex-direction: column; align-items: center; gap: 24px` para separar texto y botón.

6. **`.btn-primary` en etiqueta `<a>`**: agregado `display: inline-block; text-decoration: none`
   para que el botón se renderice correctamente como enlace.

7. **Logo no era clickeable**: en los 5 HTML el `<div class="logo">` se convirtió en
   `<a href="index.html" class="logo">`. CSS actualizado con `color: white; text-decoration: none`.

8. **Inconsistencia de documentación**: login retorna `200` (no `201`) — corregido en manual.

9. **`.env.example` eliminado accidentalmente**: recreado con el contenido correcto.

---

## Categorías Disponibles

`Audio` | `Celulares` | `Computadoras` | `Perifericos` | `Accesorios`

Definidas en:
- `frontend/index.html` — filtro del catálogo público
- `frontend/admin.html` — select del formulario de productos

---

## Comandos Importantes

```bash
# Instalar dependencias del backend
cd backend && npm install

# Desarrollo (recarga automática)
npm run dev

# Producción
npm start

# Crear admin inicial en BD (si no existe)
npm run seed-admin

# Poblar productos de prueba (si la colección está vacía)
npm run seed-productos

# Servir el frontend localmente
npx serve frontend
```

```bash
# Git: commit y push estándar
git add .
git commit -m "mensaje"
git push
```

---

## Notas para Mantenimiento

- El backend en Render tiene **cold start**: el primer request puede tardar ~30 s si el
  servicio estuvo inactivo. Es normal en el plan gratuito.
- Los `seedAdmin.js` y `seedProductos.js` existen en `backend/` como utilidades pero no
  son parte del flujo de la aplicación; no se documentan en los manuales de usuario.
- El CORS del backend está abierto (`app.use(cors())`). En producción no es problema
  porque el proxy de Netlify elimina el cross-origin, pero en desarrollo local sí aplica.
- El checkout es **atómico por item**: si el segundo item falla por stock insuficiente,
  se revierte el descuento del primero. No usa transacciones de MongoDB, sino un rollback
  manual con `$inc: { stock: +cantidad }`.
