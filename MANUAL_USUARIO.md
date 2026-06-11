# Manual de Usuario - TechStore

## Introducción

Bienvenido a **TechStore**, la tienda online de productos tecnológicos. Este manual te guiará paso a paso sobre cómo navegar, buscar productos, realizar compras simuladas y, si eres administrador, gestionar el inventario desde el panel privado.

TechStore es una plataforma diseñada para dos perfiles:

- **Clientes:** Explorar el catálogo, ver detalles de productos y simular compras
- **Administradores:** Gestionar productos, monitorear stock y consultar estadísticas del inventario

**Sitio web:** `https://techstore-yorleyner.netlify.app`

---

## 1. Acceder a TechStore

### Para Clientes

1. Abre tu navegador web (Chrome, Firefox, Edge, etc.)
2. Ingresa la URL: `https://techstore-yorleyner.netlify.app`
3. Verás automáticamente el catálogo de productos

No necesitas registrarte ni iniciar sesión para navegar y simular compras.

### Para Administradores

1. Desde cualquier página, haz clic en el enlace **"Admin"** en la esquina superior derecha de la barra de navegación
2. Si no hay sesión activa, serás redirigido a la página de inicio de sesión
3. Ingresa tus credenciales:
   - **Usuario:** `techstore_admin`
   - **Contraseña:** `techstore_admin123`
4. Haz clic en **"Iniciar sesión"**
5. Accederás directamente al panel administrativo

> **Sesión persistente:** Una vez que inicias sesión, tu sesión se mantiene activa aunque navegues al catálogo o cierres y vuelvas a abrir el navegador. Solo se cerrará si haces clic en **"Cerrar sesión"** dentro del panel admin.

---

## 2. Navegación General

### Barra Superior (Navbar)

La barra de navegación está presente en todas las páginas e incluye:

| Elemento | Función |
|---|---|
| **Logo 🛒 TechStore** | Clic para ir al catálogo principal (página de inicio) |
| **Catálogo** | Vuelve a la tienda principal |
| **Carrito (con número)** | Acceso rápido al carrito; el número indica cuántos artículos hay |
| **Admin** | Accede al panel administrativo (redirige al login si no hay sesión) |

### Pie de Página

Aparece en todas las páginas con información de copyright.

---

## 3. Guía de Compra para Clientes

### 3.1 Navegar por el Catálogo

La página principal muestra el catálogo completo con tarjetas de producto. Dispones de dos herramientas de filtrado:

**Barra de búsqueda:**
- Escribe el nombre o parte del nombre del producto (ej: `"auriculares"`, `"laptop"`, `"usb"`)
- El catálogo se actualiza automáticamente mientras escribes

**Filtro de categorías:**
- Haz clic en el menú desplegable **"Todas las categorías"**
- Selecciona una categoría para mostrar solo esos productos:
  - Audio
  - Celulares
  - Computadoras
  - Periféricos
  - Accesorios

Puedes combinar búsqueda y filtro de categoría al mismo tiempo.

**Paginación:**
- Si hay más de 10 productos, usa los botones **"← Anterior"** y **"Siguiente →"** para cambiar de página
- El indicador central muestra en qué página estás (ej: `Página 1 de 3`)

### 3.2 Ver Detalles de un Producto

1. Haz clic en la tarjeta del producto que te interesa
2. Se abrirá la página de detalle con:
   - Imagen del producto
   - Nombre y categoría
   - Descripción técnica completa
   - Precio
   - Stock disponible
   - Campo de cantidad y botón para agregar al carrito

### 3.3 Agregar Productos al Carrito

**Desde el catálogo (forma rápida):**
1. En la tarjeta del producto, haz clic en el botón **"Agregar"**
2. Se agrega una unidad directamente al carrito
3. El contador en el ícono del carrito se actualiza

**Desde la página de detalle (con cantidad):**
1. En el campo **"Cantidad"**, escribe o ajusta el número de unidades que deseas
2. Haz clic en **"Agregar al carrito"**
3. Si la cantidad supera el stock disponible, verás un mensaje de advertencia

> **Nota:** Los productos con etiqueta **"AGOTADO"** tienen el botón deshabilitado y no se pueden agregar.

### 3.4 Ver y Gestionar el Carrito

1. Haz clic en **"Carrito"** en la barra de navegación
2. Verás una tabla con todos los productos añadidos:
   - Nombre del producto
   - Precio unitario
   - Cantidad (modificable)
   - Subtotal por fila
3. Al pie de la tabla se muestra el **Total de la compra**

**Cambiar cantidad:**
- Modifica el número en la columna **"Cantidad"** directamente en la tabla
- El subtotal se recalcula automáticamente

**Eliminar un producto:**
- Haz clic en el botón **"Eliminar"** en la fila del producto

**Vaciar el carrito:**
- Haz clic en **"Limpiar carrito"**
- Se pedirá confirmación antes de proceder

> **El carrito persiste:** Los artículos se guardan en tu navegador (localStorage). Si cierras la pestaña o el navegador y regresas al sitio, los artículos seguirán en el carrito.

### 3.5 Finalizar Compra (Simular Orden)

1. Asegúrate de tener al menos un producto en el carrito
2. Haz clic en **"Finalizar compra"**
3. El sistema verifica en tiempo real que haya stock suficiente para cada artículo
4. Si todo está disponible, aparece el mensaje **"¡Compra realizada exitosamente!"** con el resumen de la orden:
   - Lista de productos comprados
   - Cantidades adquiridas
   - Stock restante en tienda tras la compra

> **Importante:** Esta es una compra **simulada** con fines demostrativos. El stock sí se descuenta de la base de datos, pero no se procesan pagos ni envíos reales.

---

## 4. Guía de Administración

### 4.1 Acceder al Panel Admin

1. Haz clic en **"Admin"** en la barra de navegación
2. Si no tienes sesión activa, ingresa las credenciales:
   - **Usuario:** `techstore_admin`
   - **Contraseña:** `techstore_admin123`
3. El panel tiene dos secciones accesibles desde el menú lateral:
   - **📊 Dashboard** — estadísticas del inventario
   - **📦 Productos** — gestión completa del catálogo

### 4.2 Dashboard

El dashboard muestra un resumen del estado del inventario en tiempo real:

**Tarjetas de métricas:**
| Tarjeta | Qué muestra |
|---|---|
| **Total de Productos** | Número total de productos registrados |
| **Productos Activos** | Productos visibles y disponibles para compra |
| **Stock Bajo ⚠️** | Cantidad de productos por debajo del stock mínimo |

**Sección "Productos con Stock Bajo":**
Lista detallada de los productos que requieren reposición, mostrando nombre, stock actual y stock mínimo configurado.

### 4.3 Crear un Nuevo Producto

1. Haz clic en la pestaña **"📦 Productos"**
2. Completa el formulario en la sección **"Nuevo Producto"**:

| Campo | Descripción | Obligatorio |
|---|---|---|
| **Nombre** | Nombre descriptivo del producto | Sí |
| **Categoría** | Audio / Celulares / Computadoras / Periféricos / Accesorios | Sí |
| **Precio** | Precio en pesos colombianos (sin puntos) | Sí |
| **Stock** | Unidades disponibles para venta | Sí |
| **Stock Mínimo** | Umbral de alerta de inventario bajo | No (default 0) |
| **Descripción** | Especificaciones técnicas y características | Sí |
| **URL de Imagen** | Enlace a imagen del producto (HTTPS recomendado) | No |
| **Producto Activo** | Checkbox para mostrar/ocultar en el catálogo público | — |

3. Haz clic en **"Guardar"**
4. El producto aparecerá de inmediato en la lista y en el catálogo público

**Ejemplo:**
```
Nombre:       Samsung Galaxy A55
Categoría:    Celulares
Precio:       1199000
Stock:        10
Stock Mínimo: 2
Descripción:  Pantalla AMOLED 6.6", cámara 50MP, batería 5000mAh
```

### 4.4 Editar un Producto

1. En la lista de productos (parte inferior de la pestaña "Productos"), localiza el producto
2. Haz clic en **"Editar"**
3. El formulario se rellena automáticamente con los datos actuales
4. Modifica los campos necesarios
5. Haz clic en **"Guardar"** para confirmar los cambios
6. Para cancelar sin guardar, haz clic en **"Cancelar"**

### 4.5 Eliminar un Producto

1. En la lista de productos, localiza el producto
2. Haz clic en **"Eliminar"**
3. Confirma la acción en el cuadro de diálogo

> **Advertencia:** La eliminación es permanente y no se puede deshacer.

### 4.6 Gestión de Stock Mínimo

El **Stock Mínimo** es el umbral de alerta del inventario. Cuando el stock de un producto es igual o menor a ese valor:
- El producto aparece en la sección "Stock Bajo" del dashboard
- La tarjeta de alerta muestra el conteo actualizado

**Valores sugeridos por tipo de producto:**
- Productos populares o de alta rotación: 3–5 unidades
- Productos de alto valor: 1–2 unidades
- Accesorios y periféricos: 5–10 unidades

### 4.7 Cerrar Sesión

Haz clic en el botón **"Cerrar sesión"** en la barra superior del panel admin. Tu sesión se cerrará y serás redirigido al catálogo público.

---

## 5. Preguntas Frecuentes (FAQ)

**¿Necesito cuenta para comprar?**
No. El catálogo y el carrito son de acceso libre, sin registro.

**¿Cómo busco un producto específico?**
Usa la barra de búsqueda en la página principal. Escribe parte del nombre o la descripción.

**¿El carrito se borra si cierro el navegador?**
No. Los artículos se guardan en el almacenamiento local del navegador (localStorage) y persisten al regresar.

**¿Qué pasa si otro cliente compra el último artículo justo antes que yo?**
Al hacer clic en "Finalizar compra", el sistema verifica el stock en tiempo real. Si no hay suficiente, te lo notifica y deberás ajustar la cantidad.

**¿La compra es real?**
No. Es una simulación: el stock se descuenta en la base de datos pero no hay procesamiento de pagos ni envíos.

**¿La sesión de admin caduca?**
Sí, el token JWT expira a las 8 horas. Pasado ese tiempo, al intentar realizar una acción admin serás redirigido automáticamente al login.

**¿Puedo subir imágenes directamente al crear un producto?**
Actualmente no. Se debe proporcionar la URL de una imagen ya alojada en internet (ej: de Google Images, el sitio del fabricante, etc.).

**¿Hay límite de productos por página en el catálogo?**
Sí, se muestran 10 productos por página. Usa la paginación para navegar entre páginas.

---

## 6. Solución de Problemas

| Problema | Solución |
|---|---|
| El sitio no carga | Verifica la URL: `https://techstore-yorleyner.netlify.app`. Recarga con F5. |
| No veo productos en el catálogo | Revisa que no haya filtros activos. Recarga la página. |
| No puedo iniciar sesión como admin | Las credenciales son sensibles a mayúsculas. Verifica: `techstore_admin` / `techstore_admin123` |
| El carrito desaparece | Solo se borra si limpias manualmente el caché del navegador (Ctrl+Shift+Supr) |
| Botón "Agregar" deshabilitado | El producto está agotado (stock = 0) |
| No puedo finalizar la compra | Verifica que todos los productos en el carrito tengan stock disponible |
| Me pide login cada vez que entro al admin | Verifica que no estés borrando el caché entre sesiones |

---

**Versión:** 1.1
**Última actualización:** Junio 2026
