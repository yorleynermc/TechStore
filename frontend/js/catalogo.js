let currentPage = 1;
let itemsPerPage = 10;

async function loadProductos(page = 1) {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const productosDiv = document.getElementById('productos');

    loading.classList.remove('hidden');
    error.classList.add('hidden');
    productosDiv.innerHTML = '';

    try {
        const categoria = document.getElementById('category-filter').value;
        const q = document.getElementById('search').value;

        const datos = await api.getProductos({
            categoria,
            q,
            page,
            limit: itemsPerPage
        });

        currentPage = page;
        displayProductos(datos.data);
        updatePagination(datos.total, currentPage, itemsPerPage);

    } catch (err) {
        error.textContent = `Error: ${err.message}`;
        error.classList.remove('hidden');
    } finally {
        loading.classList.add('hidden');
    }
}

function displayProductos(productos) {
    const productosDiv = document.getElementById('productos');

    if (productos.length === 0) {
        productosDiv.innerHTML = '<p style="grid-column: 1/-1; text-align: center;">No se encontraron productos</p>';
        return;
    }

    productosDiv.innerHTML = productos.map(p => `
        <div class="product-card" onclick="goToDetail('${p._id}')">
            <div class="product-card-img">
                ${p.imagen
                    ? `<img src="${p.imagen}" alt="${p.nombre}" onerror="this.onerror=null;this.parentElement.innerHTML='📦'">`
                    : '📦'}
            </div>
            <div class="product-card-content">
                <div class="product-card-nombre">${p.nombre}</div>
                <div class="product-card-categoria">${p.categoria}</div>
                <div class="product-card-precio">$${p.precio.toLocaleString()}</div>
                <div class="product-card-stock ${p.stock === 0 ? 'agotado' : ''}">
                    ${p.stock > 0 ? `Stock: ${p.stock}` : 'AGOTADO'}
                </div>
                <button class="product-card-btn" onclick="event.stopPropagation(); addToCartQuick('${p._id}', '${p.nombre}', ${p.precio}, ${p.stock})">
                    ${p.stock > 0 ? 'Agregar' : 'Sin stock'}
                </button>
            </div>
        </div>
    `).join('');
}

function updatePagination(total, currentPage, itemsPerPage) {
    const totalPages = Math.ceil(total / itemsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');

    pageInfo.textContent = `Página ${currentPage} de ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function goToDetail(productId) {
    window.location.href = `detalle.html?id=${productId}`;
}

async function addToCartQuick(productId, nombre, precio, stock) {
    if (stock <= 0) {
        alert('Producto sin stock');
        return;
    }

    carrito.addToCart({ _id: productId, nombre, precio, stock }, 1);
    alert('Producto agregado al carrito');
}

// Event Listeners
document.getElementById('search').addEventListener('input', () => loadProductos(1));
document.getElementById('category-filter').addEventListener('change', () => loadProductos(1));
document.getElementById('prev-page').addEventListener('click', () => {
    if (currentPage > 1) loadProductos(currentPage - 1);
});
document.getElementById('next-page').addEventListener('click', () => {
    loadProductos(currentPage + 1);
});

// Cargar productos al abrir página
loadProductos(1);

