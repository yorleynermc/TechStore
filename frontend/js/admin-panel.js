// Verificar autenticación
if (!api.token) {
    window.location.href = 'admin-login.html';
}

let editingProductoId = null;

// Tab Navigation
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;

        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));

        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');

        if (tabName === 'dashboard') loadDashboard();
        if (tabName === 'productos') loadProductosList();
    });
});

// Logout
document.getElementById('logout-btn').addEventListener('click', () => {
    api.logout();
    window.location.href = 'index.html';
});

// DASHBOARD
async function loadDashboard() {
    try {
        const datos = await api.getDashboard();
        document.getElementById('total-productos').textContent = datos.totalProductos;
        document.getElementById('productos-activos').textContent = datos.activos;
        document.getElementById('stock-bajo-count').textContent = datos.countStockBajo;

        const listDiv = document.getElementById('stock-bajo-list');
        if (datos.productosStockBajo.length === 0) {
            listDiv.innerHTML = '<p>No hay productos con stock bajo</p>';
        } else {
            listDiv.innerHTML = datos.productosStockBajo.map(p => `
                <div class="product-item">
                    <div>
                        <strong>${p.nombre}</strong> - Stock: ${p.stock} (Mínimo: ${p.minimoStock})
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

// PRODUCTOS CRUD
async function loadProductosList() {
    try {
        const datos = await api.getProductos({ limit: 100 });
        const listDiv = document.getElementById('productos-list');

        if (datos.data.length === 0) {
            listDiv.innerHTML = '<p>No hay productos</p>';
        } else {
            listDiv.innerHTML = datos.data.map(p => `
                <div class="admin-product-item">
                    <div>
                        <strong>${p.nombre}</strong> - $${p.precio} - Stock: ${p.stock}
                    </div>
                    <div class="admin-product-actions">
                        <button class="btn-edit" onclick="editProducto('${p._id}', '${p.nombre}', '${p.categoria}', ${p.precio}, ${p.stock}, ${p.minimoStock}, '${p.descripcion}', '${p.imagen}', ${p.activo})">
                            Editar
                        </button>
                    </div>
                    <div class="admin-product-actions">
                        <button class="btn-delete" onclick="deleteProducto('${p._id}')">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

function editProducto(id, nombre, categoria, precio, stock, minimoStock, descripcion, imagen, activo) {
    editingProductoId = id;
    document.getElementById('form-title').textContent = 'Editar Producto';
    document.getElementById('form-nombre').value = nombre;
    document.getElementById('form-categoria').value = categoria;
    document.getElementById('form-precio').value = precio;
    document.getElementById('form-stock').value = stock;
    document.getElementById('form-minimo').value = minimoStock;
    document.getElementById('form-descripcion').value = descripcion;
    document.getElementById('form-imagen').value = imagen;
    document.getElementById('form-activo').checked = activo;
    document.getElementById('cancel-btn').classList.remove('hidden');

    document.querySelector('.tab-btn[data-tab="productos"]').click();
    document.querySelector('.producto-form-section').scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('cancel-btn').addEventListener('click', () => {
    resetForm();
});

function resetForm() {
    document.getElementById('producto-form').reset();
    document.getElementById('form-title').textContent = 'Nuevo Producto';
    document.getElementById('cancel-btn').classList.add('hidden');
    editingProductoId = null;
    document.getElementById('form-activo').checked = true;
    clearFormErrors();
}

function clearFormErrors() {
    document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
    document.querySelectorAll('.field-error-msg').forEach(el => el.remove());
}

function showFieldError(inputEl, message) {
    inputEl.classList.add('field-error');
    const span = document.createElement('span');
    span.className = 'field-error-msg';
    span.textContent = message;
    inputEl.parentNode.appendChild(span);
}

function validateProductoForm() {
    clearFormErrors();
    let valid = true;

    const textRequired = [
        { id: 'form-nombre', label: 'Nombre' },
        { id: 'form-categoria', label: 'Categoría' },
        { id: 'form-descripcion', label: 'Descripción' }
    ];

    for (const field of textRequired) {
        const el = document.getElementById(field.id);
        if (!el.value.trim()) {
            showFieldError(el, `${field.label} es obligatorio`);
            valid = false;
        }
    }

    const precioEl = document.getElementById('form-precio');
    const precio = parseFloat(precioEl.value);
    if (precioEl.value === '' || isNaN(precio) || precio < 0) {
        showFieldError(precioEl, 'El precio debe ser un número mayor o igual a 0');
        valid = false;
    }

    const stockEl = document.getElementById('form-stock');
    const stock = parseInt(stockEl.value);
    if (stockEl.value === '' || isNaN(stock) || stock < 0) {
        showFieldError(stockEl, 'El stock debe ser un número mayor o igual a 0');
        valid = false;
    }

    return valid;
}

document.getElementById('producto-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateProductoForm()) return;

    const producto = {
        nombre: document.getElementById('form-nombre').value,
        categoria: document.getElementById('form-categoria').value,
        precio: parseFloat(document.getElementById('form-precio').value),
        stock: parseInt(document.getElementById('form-stock').value),
        minimoStock: parseInt(document.getElementById('form-minimo').value),
        descripcion: document.getElementById('form-descripcion').value,
        imagen: document.getElementById('form-imagen').value,
        activo: document.getElementById('form-activo').checked
    };

    try {
        if (editingProductoId) {
            await api.updateProducto(editingProductoId, producto);
            alert('Producto actualizado');
        } else {
            await api.createProducto(producto);
            alert('Producto creado');
        }
        resetForm();
        loadProductosList();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});

async function deleteProducto(id) {
    if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
        await api.deleteProducto(id);
        alert('Producto eliminado');
        loadProductosList();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
}

// Cargar dashboard al abrir
loadDashboard();

