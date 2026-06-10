const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./src/config/database');
const Producto = require('./src/models/Producto');

dotenv.config();

const productosIniciales = [
    {
        nombre: 'Laptop ASUS VivoBook 15',
        descripcion: 'Laptop de alto rendimiento con procesador Intel i7, 16GB RAM, 512GB SSD',
        precio: 1299999,
        stock: 8,
        categoria: 'Computadoras',
        minimoStock: 2,
        activo: true
    },
    {
        nombre: 'Auriculares Sony WH-1000XM5',
        descripcion: 'Auriculares con cancelación activa de ruido, batería 30 horas',
        precio: 449999,
        stock: 15,
        categoria: 'Audio',
        minimoStock: 3,
        activo: true
    },
    {
        nombre: 'Teclado Mecánico Corsair K95',
        descripcion: 'Teclado mecanizado RGB con macroprogramación',
        precio: 289999,
        stock: 5,
        categoria: 'Perifericos',
        minimoStock: 2,
        activo: true
    },
    {
        nombre: 'Mouse Logitech MX Master 3',
        descripcion: 'Mouse ergonómico de precisión con múltiples botones programables',
        precio: 149999,
        stock: 12,
        categoria: 'Perifericos',
        minimoStock: 3,
        activo: true
    },
    {
        nombre: 'Monitor LG 27 inch 144Hz',
        descripcion: 'Monitor gaming IPS 27", 1440p, 144Hz, tiempo respuesta 1ms',
        precio: 799999,
        stock: 3,
        categoria: 'Accesorios',
        minimoStock: 2,
        activo: true
    },
    {
        nombre: 'Webcam Logitech 4K Pro',
        descripcion: 'Webcam 4K con enfoque automático y micrófono estéreo',
        precio: 179999,
        stock: 0,
        categoria: 'Accesorios',
        minimoStock: 2,
        activo: true
    },
    {
        nombre: 'Mousepad SteelSeries QcK',
        descripcion: 'Mousepad de tela de alta precisión, tamaño XL',
        precio: 39999,
        stock: 1,
        categoria: 'Accesorios',
        minimoStock: 5,
        activo: true
    },
    {
        nombre: 'Hub USB-C Anker',
        descripcion: 'Hub con 7 puertos USB-C, carga rápida y transferencia de datos',
        precio: 99999,
        stock: 20,
        categoria: 'Accesorios',
        minimoStock: 5,
        activo: true
    }
];

const seed = async () => {
    try {
        await connectDB();

        const count = await Producto.countDocuments();
        if (count > 0) {
            console.log('Ya existen productos en la BD');
            process.exit(0);
        }

        await Producto.insertMany(productosIniciales);
        console.log(`✅ ${productosIniciales.length} productos creados`);
        process.exit(0);
    } catch (error) {
        console.error('Error al crear productos:', error.message);
        process.exit(1);
    }
};

seed();

