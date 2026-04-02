const express = require("express");
const router = express.Router();
const productoController = require("../controllers/productoController");
const auth = require("../middlewares/auth");
const checkRole = require("../middlewares/rol");

/**
 * @swagger
 * tags:
 *   name: Productos
 *   description: Gestión de inventario de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       required:
 *         - nombreProducto
 *         - descripcion
 *         - precio
 *         - stock
 *         - categoria
 *         - productor
 *         - negocioId
 *         - ubicacion
 *       properties:
 *         _id:
 *           type: string
 *           example: 664f1b2c3e4a5b6c7d8e9f00
 *         nombreProducto:
 *           type: string
 *           example: Manzana orgánica
 *         descripcion:
 *           type: string
 *           example: Manzana roja cultivada sin pesticidas
 *         precio:
 *           type: number
 *           example: 25.5
 *         stock:
 *           type: number
 *           example: 100
 *         categoria:
 *           type: string
 *           enum: [Frutas, Verduras, Granos, Lacteos, Otros]
 *           example: Frutas
 *         productor:
 *           type: string
 *           example: Rancho El Verde
 *         negocioId:
 *           type: string
 *           example: negocio_001
 *         alerta:
 *           type: string
 *           example: Stock bajo
 *         ubicacion:
 *           type: string
 *           example: Bodega A, estante 3
 *         nivelStock:
 *           type: string
 *           enum: [bajo, medio, alto]
 *           example: alto
 */

/**
 * @swagger
 * /api/productos:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/", auth, productoController.getProductos);

/**
 * @swagger
 * /api/productos:
 *   post:
 *     summary: Crear un producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombreProducto
 *               - descripcion
 *               - precio
 *               - stock
 *               - categoria
 *               - productor
 *               - ubicacion
 *             properties:
 *               nombreProducto:
 *                 type: string
 *                 example: Manzana orgánica
 *               descripcion:
 *                 type: string
 *                 example: Manzana roja cultivada sin pesticidas
 *               precio:
 *                 type: number
 *                 example: 25.5
 *               stock:
 *                 type: number
 *                 example: 100
 *               categoria:
 *                 type: string
 *                 enum: [Frutas, Verduras, Granos, Lacteos, Otros]
 *                 example: Frutas
 *               productor:
 *                 type: string
 *                 example: Rancho El Verde
 *               ubicacion:
 *                 type: string
 *                 example: Bodega A, estante 3
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Producto'
 *       401:
 *         description: Token inválido o ausente
 *       403:
 *         description: Acceso denegado — se requiere rol admin
 */
router.post("/", auth, checkRole("admin"), productoController.createProducto);

/**
 * @swagger
 * /api/productos/bajo-stock:
 *   get:
 *     summary: Obtener productos con stock bajo
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Productos con nivelStock igual a "bajo"
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *       401:
 *         description: Token inválido o ausente
 */
router.get("/bajo-stock", auth, productoController.getBajoStock);

/**
 * @swagger
 * /api/productos/{id}:
 *   put:
 *     summary: Actualizar producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               stock:
 *                 type: number
 *                 example: 5
 *               precio:
 *                 type: number
 *                 example: 30
 *     responses:
 *       200:
 *         description: Producto actualizado
 */
router.put("/:id", auth, checkRole("admin"), productoController.updateProducto); // actualizar producto (solo admin)


// eliminar 
/**
 * @swagger
 * /api/productos/{id}:
 *   delete:
 *     summary: Eliminar producto (solo admin)
 *     tags: [Productos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 */
router.delete("/:id", auth, checkRole("admin"), productoController.deleteProducto);

module.exports = router;