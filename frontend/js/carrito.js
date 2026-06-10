// Gestiona el carrito de compras usando localStorage como capa de persistencia,
// por lo que los items sobreviven recargas y cierres de pestaña.
class CarritoManager {
    constructor() {
        this.cartKey = 'techstore_carrito';
        this.carrito = this.loadCarrito();
    }

    loadCarrito() {
        const stored = localStorage.getItem(this.cartKey);
        return stored ? JSON.parse(stored) : [];
    }

    saveCarrito() {
        localStorage.setItem(this.cartKey, JSON.stringify(this.carrito));
        this.updateCartCount();
    }

    addToCart(producto, cantidad = 1) {
        const existente = this.carrito.find(item => item._id === producto._id);

        if (existente) {
            existente.cantidad += cantidad;
        } else {
            this.carrito.push({
                ...producto,
                cantidad
            });
        }

        this.saveCarrito();
    }

    removeFromCart(productId) {
        this.carrito = this.carrito.filter(item => item._id !== productId);
        this.saveCarrito();
    }

    updateQuantity(productId, cantidad) {
        const item = this.carrito.find(item => item._id === productId);
        if (item) {
            item.cantidad = Math.max(1, cantidad);
            this.saveCarrito();
        }
    }

    clearCart() {
        this.carrito = [];
        this.saveCarrito();
    }

    getTotal() {
        return this.carrito.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
    }

    getCartItems() {
        return this.carrito;
    }

    updateCartCount() {
        const countElements = document.querySelectorAll('#cart-count');
        const count = this.carrito.reduce((sum, item) => sum + item.cantidad, 0);
        countElements.forEach(el => el.textContent = count);
    }
}

const carrito = new CarritoManager();
carrito.updateCartCount();

