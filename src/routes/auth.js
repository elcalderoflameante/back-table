const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');
const router = express.Router();

const JWT_SECRET = process.env.SECRET_KEY || 'ECF_2025_PROD';

// Registro de usuario
router.post('/register', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ username, password: hash });
    res.status(201).json({ message: 'Usuario creado', usuario: { id: usuario.id, username: usuario.username } });
  } catch (err) {
    next(err);
  }
});

// Login de usuario
router.post('/login', async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username y password son requeridos' });
    }
    const usuario = await Usuario.findOne({ where: { username } });
    if (!usuario) return res.status(401).json({ message: 'Credenciales inválidas' });

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) return res.status(401).json({ message: 'Credenciales inválidas' });

    const token = jwt.sign({ id: usuario.id, username: usuario.username }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    next(err);
  }
});

module.exports = router;