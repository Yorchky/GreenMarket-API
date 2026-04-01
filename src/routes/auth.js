const express = require("express");
const router = express.Router();
const authController = require("../controllers/usuarioController");
const auth = require("../middlewares/auth");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Registro e inicio de sesión de usuarios
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Usuario:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           example: 664f1b2c3e4a5b6c7d8e9f00
 *         email:
 *           type: string
 *           example: juan@example.com
 *         rol:
 *           type: string
 *           enum: [admin, user]
 *           example: user
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: secreto123
 *               rol:
 *                 type: string
 *                 enum: [admin, user]
 *                 example: user
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Usuario'
 *       400:
 *         description: Datos inválidos o usuario ya existe
 */
router.post("/register", authController.registerUsuario);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 example: secreto123
 *     responses:
 *       200:
 *         description: Login exitoso, retorna JWT
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Credenciales incorrectas
 */
router.post("/login", authController.loginUsuario);

/**
 * @swagger
 * /api/auth/perfil:
 *   get:
 *     summary: Obtener perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del perfil sin password
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/perfil", auth, authController.getPerfil);

/**
 * @swagger
 * /api/auth/perfil:
 *   put:
 *     summary: Actualizar perfil del usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombreNegocio:
 *                 type: string
 *                 example: Verduras El Campo
 *               descripcion:
 *                 type: string
 *                 example: Tienda de productos orgánicos
 *               umbralStockBajo:
 *                 type: number
 *                 example: 10
 *               umbralStockMedio:
 *                 type: number
 *                 example: 50
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *       401:
 *         description: Token inválido o ausente
 */
router.put("/perfil", auth, authController.actualizarPerfil);

module.exports = router;