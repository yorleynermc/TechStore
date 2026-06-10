const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Verifica JWT y luego confirma que el admin aún existe en BD.
// La consulta a BD es necesaria porque un token válido podría pertenecer
// a un admin ya eliminado (el token no expira al borrar el registro).
const protegerRuta = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) return res.status(401).json({ mensaje: 'No token proporcionado' });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');

    const admin = await Admin.findById(decoded.id);
    if (!admin) return res.status(401).json({ mensaje: 'Token inválido' });

    req.admin = { id: admin._id, username: admin.username };
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido' });
  }
};

module.exports = { protegerRuta };

