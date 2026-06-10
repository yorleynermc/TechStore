const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./src/config/database");

const productoRoutes = require("./src/routes/productoRoutes");
const authRoutes = require("./src/routes/authRoutes");

// Cargar variables de entorno lo antes posible
dotenv.config();

const app = express();

// Middleware para CORS y leer JSON
app.use(cors());
app.use(express.json({ limit: '5mb' }));

// Ruta principal
app.get("/", (req, res) => {
    res.send("TechStore API funcionando");
});

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/productos", productoRoutes);

// Middleware simple de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ mensaje: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;

// Iniciar servidor solo después de conectar a MongoDB
const startServer = async () => {
    try {
        console.log("\n🔗 Conectando a MongoDB...\n");

        await connectDB();

        console.log("\n✅ Conexión exitosa!\n");

        app.listen(PORT, () => {
            console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}\n`);
        });

    } catch (error) {
        console.error("\n❌ No se pudo iniciar el servidor");
        console.error("Error:", error.message);
        process.exit(1);
    }
};

startServer();