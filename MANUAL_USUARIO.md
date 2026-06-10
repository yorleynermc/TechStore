# Manual de Usuario - TechStore

## Introducción

Bienvenido a **TechStore**, la tienda online de productos tecnológicos. Este manual te guiará paso a paso sobre cómo navegar, buscar productos, realizar compras y (si eres administrador) gestionar el inventario.

TechStore es una plataforma diseñada para:
- **Clientes:** Explorar y comprar productos tecnológicos de forma sencilla
- **Administradores:** Gestionar el catálogo de productos y monitorear el inventario

---

## 1. Acceder a TechStore

### Para Clientes

1. Abre tu navegador web
2. Ingresa la URL: `https://techstore-yorleyner.netlify.app`
3. Verás la página de inicio con el catálogo de productos

### Para Administradores

1. En la esquina superior derecha, haz clic en "Admin"
2. Se abrirá la página de login administrativo
3. Ingresa tus credenciales:
   - **Usuario:** `techstore_admin`
   - **Contraseña:** `techstore_admin123`
4. Haz clic en "Iniciar sesión"
5. Se abrirá el panel administrativo

---

## 2. Guía de Compra para Clientes

### 2.1 Navegar por el Catálogo

En la página principal verás:
- **Barra de búsqueda:** Escribe el nombre del producto que buscas (ej: "auriculares", "laptop")
- **Filtro de categorías:** Selecciona una categoría para filtrar
  - Audio
  - Computadoras
  - Periféricos
  - Accesorios
- **Paginación:** Usa los botones "Anterior" y "Siguiente" para cambiar de página

**Ejemplo:** Para encontrar auriculares de audio:
1. Haz clic en el dropdown "Todas las categorías"
2. Selecciona "Audio"
3. Los productos se filtrarán automáticamente

### 2.2 Ver Detalles de un Producto

1. Haz clic en la tarjeta de cualquier producto
2. Se abrirá la página de detalles con:
   - Nombre del producto
   - Descripción completa
   - Precio
   - Stock disponible
   - Botón para agregar al carrito

### 2.3 Agregar Productos al Carrito

**Opción 1: Desde el catálogo**
1. En la tarjeta del producto, haz clic en "Agregar"
2. Aparecerá un mensaje confirmando que se añadió al carrito

**Opción 2: Desde la página de detalles**
1. Abre el detalle del producto
2. Usa el campo de cantidad para especificar cuántas unidades deseas
3. Haz clic en "Agregar al carrito"

**Nota:** Si un producto tiene etiqueta "AGOTADO", no podrás agregarlo.

### 2.4 Ver el Carrito

1. Haz clic en el icono "Carrito" en la esquina superior derecha
2. Se abrirá tu carrito con todos los productos añadidos
3. Verás:
   - Nombre de cada producto
   - Precio unitario
   - Cantidad (puedes modificarla)
   - Subtotal por producto
   - **Total de la compra**

### 2.5 Modificar el Carrito

**Cambiar cantidad:**
1. En la columna "Cantidad", modifica el número
2. El subtotal se actualizará automáticamente

**Eliminar un producto:**
1. Haz clic en el botón "Eliminar" en la fila del producto
2. Se eliminará del carrito

**Limpiar carrito completo:**
1. Haz clic en "Limpiar carrito"
2. Se confirmará la acción (puedes cancelar)

### 2.6 Finalizar Compra (Simular Orden)

1. Asegúrate de tener productos en tu carrito
2. Haz clic en "Finalizar compra"
3. El sistema validará que haya stock disponible
4. Si todo es correcto, verás un mensaje de **"¡Compra realizada exitosamente!"**
5. Se mostrará un resumen con:
   - Lista de productos comprados
   - Cantidades
   - Stock restante después de la compra

**Nota:** Esta es una compra simulada. En un sistema real, se procederían pagos y envíos.

---

## 3. Guía de Administración

### 3.1 Acceder al Panel Admin

1. Haz clic en "Admin" (arriba a la derecha)
2. Ingresa las credenciales:
   - Usuario: `techstore_admin`
   - Contraseña: `techstore_admin123`
3. Verás el panel con dos secciones: **Dashboard** y **Productos**

### 3.2 Ver Dashboard

El dashboard muestra resumen estadístico:

**Tarjetas de información:**
- **Total de Productos:** Número total de productos en el inventario
- **Productos Activos:** Productos disponibles para compra
- **Stock Bajo ⚠️:** Número de productos con alerta de stock

**Sección de Stock Bajo:**
Lista detallada de productos que están por debajo del stock mínimo, mostrando:
- Nombre del producto
- Stock actual
- Stock mínimo requerido

**Uso:** Revisa esta información regularmente para reponer inventario.

### 3.3 Gestionar Productos

#### 3.3.1 Crear un Nuevo Producto

1. Haz clic en la pestaña "📦 Productos"
2. Completa el formulario "Nuevo Producto":
   - **Nombre:** Nombre descriptivo (ej: "Laptop ASUS VivoBook 15")
   - **Categoría:** Selecciona de la lista
   - **Precio:** Ingresa el precio en pesos
   - **Stock:** Cantidad disponible
   - **Stock Mínimo:** Cantidad que genera alerta (ej: 2)
   - **Descripción:** Detalles técnicos del producto
   - **URL de Imagen:** Enlace a imagen online (opcional)
   - **Producto Activo:** Marca para que esté disponible

3. Haz clic en "Guardar"
4. Si todo es correcto, verás el producto en la lista abajo

**Ejemplo:**
```
Nombre: Auriculares Sony WH-1000XM5
Categoría: Audio
Precio: 449999
Stock: 15
Stock Mínimo: 3
Descripción: Auriculares con cancelación activa de ruido, batería 30 horas
```

#### 3.3.2 Editar un Producto

1. En la lista de productos abajo, busca el producto a editar
2. Haz clic en el botón "Editar"
3. El formulario se rellenará con los datos actuales
4. Modifica los campos que necesites
5. Haz clic en "Guardar"
6. El producto se actualizará automáticamente

#### 3.3.3 Eliminar un Producto

1. En la lista de productos, busca el producto
2. Haz clic en el botón "Eliminar"
3. Se pedirá confirmación
4. Confirma y el producto se eliminará de la tienda

**Advertencia:** Esta acción no se puede deshacer.

### 3.4 Gestionar Stock

**¿Por qué es importante el stock mínimo?**

El "Stock Mínimo" es un umbral de alerta. Cuando el stock de un producto cae por debajo de este nivel:
- El producto aparecerá en la sección "Stock Bajo" del dashboard
- Sabrás que necesitas reponer inventario

**Cómo establecer stock mínimo:**

Al crear o editar un producto, asigna un valor razonable. Por ejemplo:
- Para productos populares: 3-5 unidades
- Para productos caros: 1-2 unidades
- Para periféricos: 5-10 unidades

### 3.5 Monitoreo Regular

**Recomendamos revisar el admin diariamente:**

1. Accede al panel
2. Revisa el dashboard
3. Si hay productos con "Stock Bajo", considera reponer
4. Actualiza precios si es necesario
5. Desactiva productos discontinuados

---

## 4. Navegación General

### Barra Superior (Navbar)

En cualquier página verás la barra superior con:
- **Logo TechStore:** Enlace a la página principal
- **Catálogo:** Vuelve a la tienda principal
- **Carrito (con número):** Acceso rápido al carrito
- **Admin:** Acceso al panel administrativo

### Pie de Página

Aparece en todas las páginas con información de copyright.

---

## 5. Preguntas Frecuentes (FAQ)

### ¿Cómo busco un producto específico?

Usa la **barra de búsqueda** en la página principal. Escribe parte del nombre y se filtrarán automáticamente.

### ¿Puedo cambiar la cantidad después de agregar al carrito?

Sí. Ve al carrito, modifica el número en la columna "Cantidad" y se actualiza automáticamente.

### ¿Qué pasa si agoto el stock durante la compra?

Si otro cliente compra justo antes que tú, el sistema lo detectará al finalizar y te notificará que no hay stock. Deberás ajustar cantidades.

### ¿Es una compra real o simulada?

Es una **compra simulada**. Útil para pruebas. En un sistema real, incluiría pasarela de pagos y envío.

### ¿Qué pasa si cierro el navegador con items en el carrito?

Tu carrito se guarda en el navegador (localStorage). Al regresar, los items seguirán ahí.

### ¿Cómo cambio mi contraseña de admin?

Por ahora, la contraseña es fija. Para cambiarla, requiere acceso directo a la base de datos o un panel de usuarios más avanzado.

### ¿Puedo subir imágenes directamente?

Actualmente, debes proporcionar la **URL de una imagen online**. En futuras versiones se podría agregar carga directa.

### ¿Hay límite de productos por página?

Sí, se muestran 10 por página. Usa paginación para navegar.

---

## 6. Solución de Problemas

### El sitio no carga
- Verifica que estés en: `https://techstore-yorleyner.netlify.app`
- Si pruebas en local, abre los archivos HTML directamente en el navegador
- Recarga la página (F5)

### No puedo loguearme como admin
- Verifica usuario y contraseña (SENSIBLES A MAYÚSCULAS)
- Cierra sesión anterior (si la hay) y vuelve a intentar
- Limpia cache del navegador (Ctrl+Shift+Del)

### No veo productos
- Verifica que la BD esté poblada (ejecuta `npm run seed-productos`)
- Revisa los filtros (algunos podrían ocultar productos)
- Recarga la página

### El carrito desaparece
- Es normal si limpias el cache del navegador
- Los datos se guardan en localStorage (navegador)
- Si necesita persistencia, requiere cuenta de usuario

### No puedo agregar al carrito
- Verifica que el producto tenga stock
- Los productos agotados tienen botón deshabilitado

---

## 7. Consejos y Buenas Prácticas

1. **Mantén precios actualizados:** Revisa periódicamente que reflejen el mercado real
2. **Monitorea stock:** No dejes productos agotados sin reponer
3. **Usa descripciones claras:** Ayuda a clientes a entender el producto
4. **Imágenes de calidad:** Usa URLs de imágenes profesionales
5. **Categorías consistentes:** Evita crear categorías nuevas innecesariamente

---

## 8. Contacto y Soporte

Para problemas técnicos o sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0  
**Última actualización:** Junio 2026

