# TechStore - Backend

Pequeña API REST para la tienda de productos tecnológicos.

Requisitos:
- Node.js 18+
- MongoDB local o Atlas

Instalación:

```powershell
cd backend
npm install
cp .env.example .env
# editar .env con la URI de MongoDB
npm run dev
```

Rutas principales:
- GET /api/productos
- GET /api/productos/:id
- POST /api/productos
- PUT /api/productos/:id
- DELETE /api/productos/:id
- GET /api/productos/stock-bajo

Notas:
- No subir `.env` al repositorio.
- Implementar autenticación para rutas admin antes de exponer en producción.

