async function loadProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (!productId) {
        window.location.href = 'index.html';
        return;
    }

    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const detail = document.getElementById('product-detail');

    loading.classList.remove('hidden');

    try {
        const producto = await api.getProducto(productId);
        displayProductDetail(producto);
        detail.classList.remove('hidden');
    } catch (err) {
        error.textContent = `Error: ${err.message}`;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayProductDetail(producto) {
    document.getElementById('img').src = producto.imagen || 'https://via.placeholder.com/400';
    document.getElementById('nombre').textContent = producto.nombre;
    document.getElementById('categoria').textContent = `Categoría: ${producto.categoria}`;
    document.getElementById('descripcion').textContent = producto.descripcion;
    document.getElementById('precio').textContent = `$${producto.precio.toLocaleString()}`;

    const stockEl = document.getElementById('stock');
    if (producto.stock > 0) {
        stockEl.textContent = `Stock disponible: ${producto.stock}`;
        document.getElementById('add-to-cart').disabled = false;
    } else {
        stockEl.textContent = '❌ Producto agotado';
        stockEl.style.color = '#ff0000';
        document.getElementById('add-to-cart').disabled = true;
        document.getElementById('cantidad').disabled = true;
    }

    // Guardar producto actual para agregar al carrito
    window.currentProducto = producto;
}

document.getElementById('add-to-cart').addEventListener('click', () => {
    const cantidadEl = document.getElementById('cantidad');
    const cantidad = parseInt(cantidadEl.value);

    // Ensure the error element exists below the input
    let errorEl = document.getElementById('cantidad-error');
    if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.id = 'cantidad-error';
        errorEl.className = 'field-error-msg';
        cantidadEl.parentNode.insertBefore(errorEl, cantidadEl.nextSibling);
    }

    errorEl.textContent = '';
    cantidadEl.classList.remove('field-error');

    if (isNaN(cantidad) || cantidad <= 0) {
        errorEl.textContent = 'Ingresa una cantidad válida (mínimo 1)';
        cantidadEl.classList.add('field-error');
        return;
    }

    if (cantidad > window.currentProducto.stock) {
        errorEl.textContent = `Solo hay ${window.currentProducto.stock} unidad(es) disponibles`;
        cantidadEl.classList.add('field-error');
        return;
    }

    carrito.addToCart(window.currentProducto, cantidad);
    alert(`Se agregaron ${cantidad} unidad(es) al carrito`);
    cantidadEl.value = 1;
});

// Cargar producto al abrir página
loadProductDetail();

