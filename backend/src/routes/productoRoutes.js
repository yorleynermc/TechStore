const express = require("express");

const router = express.Router();

const {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerStockBajo,
    obtenerDashboard,
    checkout
} = require("../controllers/productoController");

const { protegerRuta } = require('../middleware/authMiddleware');

// Rutas públicas
router.get("/", obtenerProductos);
router.post("/carrito/checkout", checkout);

// Rutas protegidas (admin)
router.get("/stock-bajo", protegerRuta, obtenerStockBajo); // listar productos con stock <= minimoStock
router.get("/dashboard", protegerRuta, obtenerDashboard);

// Detalle (debe ir después de rutas específicas)
router.get("/:id", obtenerProducto);

router.post("/", protegerRuta, crearProducto);

router.put("/:id", protegerRuta, actualizarProducto);

router.delete("/:id", protegerRuta, eliminarProducto);

module.exports = router;