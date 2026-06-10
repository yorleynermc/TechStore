const Producto = require("../models/Producto");

// Catálogo público: soporta filtro por categoría, búsqueda full-text y paginación.
// El filtro `activo` permite que el admin oculte productos sin eliminarlos.
const obtenerProductos = async (req, res) => {
    try {
        const { categoria, q, page = 1, limit = 10, activo } = req.query;

        const filtro = {};

        if (categoria) filtro.categoria = categoria;
        if (activo !== undefined) filtro.activo = activo === 'true';
        if (q) filtro.$or = [
            { nombre: { $regex: q, $options: 'i' } },
            { descripcion: { $regex: q, $options: 'i' } }
        ];

        const pagina = Math.max(parseInt(page, 10), 1);
        const tamano = Math.max(parseInt(limit, 10), 1);

        const total = await Producto.countDocuments(filtro);
        const productos = await Producto.find(filtro)
            .skip((pagina - 1) * tamano)
            .limit(tamano)
            .sort({ createdAt: -1 });

        res.status(200).json({
            total,
            page: pagina,
            limit: tamano,
            data: productos
        });
    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Detalle de producto individual; devuelve 404 explícito para IDs inexistentes.
const obtenerProducto = async (req, res) => {
    try {
        const producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// Creación de producto; la validación de tipos y rangos la enforcea el esquema Mongoose.
const crearProducto = async (req, res) => {
    try {
        const { nombre, descripcion, precio, stock, categoria, imagen, minimoStock, activo } = req.body;

        if (!nombre || !descripcion || precio === undefined || stock === undefined || !categoria) {
            return res.status(400).json({ mensaje: 'Campos obligatorios faltantes' });
        }

        const producto = await Producto.create({ nombre, descripcion, precio, stock, categoria, imagen, minimoStock, activo });

        res.status(201).json(producto);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Actualizar producto
const actualizarProducto = async (req, res) => {
    try {

        const producto = await Producto.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json(producto);

    } catch (error) {
        res.status(400).json({
            mensaje: error.message
        });
    }
};

// Eliminar producto
const eliminarProducto = async (req, res) => {
    try {

        const producto = await Producto.findByIdAndDelete(
            req.params.id
        );

        if (!producto) {
            return res.status(404).json({
                mensaje: "Producto no encontrado"
            });
        }

        res.status(200).json({
            mensaje: "Producto eliminado"
        });

    } catch (error) {
        res.status(500).json({
            mensaje: error.message
        });
    }
};

// $expr permite comparar dos campos del mismo documento (stock vs minimoStock).
// No es posible hacer esta comparación con operadores de consulta normales.
const obtenerStockBajo = async (req, res) => {
    try {
        const productos = await Producto.find({ $expr: { $lte: ["$stock", "$minimoStock"] } }).sort({ stock: 1 });

        res.status(200).json({ total: productos.length, data: productos });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Obtener métricas básicas para dashboard admin
const obtenerDashboard = async (req, res) => {
    try {
        const totalProductos = await Producto.countDocuments();
        const activos = await Producto.countDocuments({ activo: true });
        const productosStockBajo = await Producto.find({ $expr: { $lte: ["$stock", "$minimoStock"] } }).limit(10).sort({ stock: 1 });
        const countStockBajo = productosStockBajo.length;

        res.status(200).json({
            totalProductos,
            activos,
            countStockBajo,
            productosStockBajo
        });
    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

// Checkout atómico: decrementa stock solo si hay suficiente ($gte en la misma query),
// evitando condición de carrera en ventas simultáneas. Si algún item falla,
// se revierte (rollback manual) el stock de los items ya procesados.
const checkout = async (req, res) => {
    try {
        const { items } = req.body;
        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ mensaje: 'Items inválidos' });
        }

        // Guardar cambios para posible rollback
        const updated = [];

        for (const it of items) {
            const { productId, cantidad } = it;
            if (!productId || !Number.isInteger(cantidad) || cantidad <= 0) {
                // rollback
                for (const u of updated) {
                    await Producto.findByIdAndUpdate(u.id, { $inc: { stock: u.qty } });
                }
                return res.status(400).json({ mensaje: 'Item con datos inválidos' });
            }

            // Intentar decrementar stock solo si hay suficiente
            const result = await Producto.findOneAndUpdate(
                { _id: productId, stock: { $gte: cantidad } },
                { $inc: { stock: -cantidad } },
                { new: true }
            );

            if (!result) {
                // rollback
                for (const u of updated) {
                    await Producto.findByIdAndUpdate(u.id, { $inc: { stock: u.qty } });
                }
                return res.status(409).json({ mensaje: `Stock insuficiente para producto ${productId}` });
            }

            updated.push({ id: productId, qty: cantidad });
        }

        // Resumen de la orden simulada
        const resumen = [];
        for (const u of updated) {
            const p = await Producto.findById(u.id);
            resumen.push({ id: p._id, nombre: p.nombre, cantidad: u.qty, stockRestante: p.stock });
        }

        res.status(200).json({ mensaje: 'Compra simulada exitosa', resumen });

    } catch (error) {
        res.status(500).json({ mensaje: error.message });
    }
};

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerStockBajo,
    obtenerDashboard,
    checkout
};