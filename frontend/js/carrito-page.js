function renderCarrito() {
    const items = carrito.getCartItems();
    const carritoVacio = document.getElementById('carrito-vacio');
    const carritoContenido = document.getElementById('carrito-contenido');
    const checkoutSuccess = document.getElementById('checkout-success');

    checkoutSuccess.classList.add('hidden');

    if (items.length === 0) {
        carritoVacio.classList.remove('hidden');
        carritoContenido.classList.add('hidden');
        return;
    }

    carritoVacio.classList.add('hidden');
    carritoContenido.classList.remove('hidden');

    const tbody = document.getElementById('carrito-items');
    tbody.innerHTML = items.map(item => `
        <tr>
            <td>${item.nombre}</td>
            <td>$${item.precio.toLocaleString()}</td>
            <td>
                <input type="number" min="1" value="${item.cantidad}"
                    onchange="carrito.updateQuantity('${item._id}', this.value); renderCarrito()">
            </td>
            <td>$${(item.precio * item.cantidad).toLocaleString()}</td>
            <td>
                <button class="btn-delete" onclick="carrito.removeFromCart('${item._id}'); renderCarrito()">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    const total = carrito.getTotal();
    document.getElementById('subtotal').textContent = `$${total.toLocaleString()}`;
    document.getElementById('total').textContent = `$${total.toLocaleString()}`;
}

document.getElementById('limpiar-carrito').addEventListener('click', () => {
    if (confirm('¿Estás seguro de que deseas limpiar el carrito?')) {
        carrito.clearCart();
        renderCarrito();
    }
});

document.getElementById('finalizar-compra').addEventListener('click', async () => {
    const items = carrito.getCartItems().map(item => ({
        productId: item._id,
        cantidad: item.cantidad
    }));

    if (items.length === 0) {
        alert('El carrito está vacío');
        return;
    }

    try {
        const resultado = await api.checkout(items);

        document.getElementById('carrito-contenido').classList.add('hidden');
        document.getElementById('checkout-success').classList.remove('hidden');

        // Mostrar resumen
        let resumenHTML = '<h3>Resumen de compra:</h3><ul>';
        resultado.resumen.forEach(item => {
            resumenHTML += `<li>${item.nombre} - Cantidad: ${item.cantidad}</li>`;
        });
        resumenHTML += '</ul>';
        document.getElementById('checkout-resumen').innerHTML = resumenHTML;

        carrito.clearCart();
        renderCarrito();
    } catch (err) {
        alert(`Error: ${err.message}`);
    }
});

// Renderizar carrito al cargar página
renderCarrito();

