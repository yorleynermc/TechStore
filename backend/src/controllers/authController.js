const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Autenticación de administrador. Devuelve el mismo mensaje para usuario inexistente
// y contraseña incorrecta para evitar enumeración de usuarios.
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ mensaje: 'Username y password son requeridos' });

    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ mensaje: 'Credenciales inválidas' });

    const payload = { id: admin._id, username: admin.username, role: admin.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secretkey', { expiresIn: '8h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: error.message });
  }
};

module.exports = { login };

