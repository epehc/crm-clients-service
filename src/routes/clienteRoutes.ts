import express from "express";
import {body, param} from "express-validator";
import {
    createCliente,
    deleteCliente,
    getAllClientes,
    getClienteByClienteId,
    getClienteByNit,
    getClientes,
    updateCliente
} from "../controllers/clienteController";
import {authenticateJWT} from "@epehc/sharedutilities/middlewares/authMiddleware";
import {authorize} from "@epehc/sharedutilities/middlewares/authorize";
import {UserRole} from "@epehc/sharedutilities/enums/userRole";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API for managing clientes
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Cliente:
 *       type: object
 *       required:
 *         - client_id
 *         - nombre
 *         - direccion
 *         - telefono
 *         - persona_contacto
 *         - telefono_persona_contacto
 *         - email_persona_contacto
 *         - nit
 *         - plazas
 *         - saldo_pendiente
 *         - saldo_vencido
 *         - credito_por_dias
 *       properties:
 *         client_id:
 *           type: string
 *           format: uuid
 *         nombre:
 *           type: string
 *         direccion:
 *           type: string
 *         telefono:
 *           type: string
 *         persona_contacto:
 *           type: string
 *         telefono_persona_contacto:
 *           type: string
 *         email_persona_contacto:
 *           type: string
 *           format: email
 *         nit:
 *           type: string
 *         plazas:
 *           type: array
 *           items:
 *             type: string
 *         saldo_pendiente:
 *           type: number
 *           format: float
 *         saldo_vencido:
 *           type: number
 *           format: float
 *         credito_por_dias:
 *           type: integer
 */

/**
 * @swagger
 * /clientes:
 *   get:
 *     summary: Get all clientes
 *     tags: [Clientes]
 *     responses:
 *       200:
 *         description: List of all clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 */
router.get('/',
    authenticateJWT,
    authorize([UserRole.Admin, UserRole.Reclutador]),
    getClientes);

router.get('/all',
    authenticateJWT,
    authorize([UserRole.Admin, UserRole.Reclutador]),
    getAllClientes);

/**
 * @swagger
 * /clientes/{cliente_id}:
 *   get:
 *     summary: Get a cliente by ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cliente ID
 *     responses:
 *       200:
 *         description: Cliente data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente not found
 */
router.get('/:client_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('client_id').isUUID().withMessage('Cliente ID es requerido')
    ],
    getClienteByClienteId);

/**
 * @swagger
 * /clientes:
 *   post:
 *     summary: Create a new cliente
 *     tags: [Clientes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       400:
 *         description: Invalid input
 */
router.post(
    '/',
    authenticateJWT,
    authorize([UserRole.Admin, UserRole.Reclutador]),
    [
        //body('cliente_id').isUUID(),
        body('nombre').isString().notEmpty().withMessage('Nombre es requerido'),
        body('direccion').isString().notEmpty().withMessage('Direccion es requerida'),
        body('telefono').isString().notEmpty().withMessage('Telefono es requerido'),
        body('nit').isString().notEmpty().withMessage('NIT es requerido'),
        body('plazas').optional().isArray(),
        body('saldo_pendiente').optional().isFloat(),
        body('saldo_vencido').optional().isFloat(),
        body('credito_por_dias').optional().isInt()
    ],
    createCliente
);


/**
 * @swagger
 * /clientes/{cliente_id}:
 *   put:
 *     summary: Update a cliente by ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cliente ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente not found
 *       400:
 *         description: Invalid input
 */
router.put(
    '/:client_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('client_id').isUUID(),
        body('nombre').isString().notEmpty().withMessage('Nombre es requerido'),
        body('direccion').isString().notEmpty().withMessage('Direccion es requerida'),
        body('telefono').isString().notEmpty().withMessage('Telefono es requerido'),
        body('nit').isString().notEmpty().withMessage('NIT es requerido'),
        body('plazas').optional().isArray(),
        body('saldo_pendiente').optional().isNumeric(),
        body('saldo_vencido').optional().isNumeric(),
        body('credito_por_dias').optional().isInt()
    ],
    updateCliente
);

/**
 * @swagger
 * /clientes/{cliente_id}:
 *   delete:
 *     summary: Delete a cliente by ID
 *     tags: [Clientes]
 *     parameters:
 *       - in: path
 *         name: cliente_id
 *         schema:
 *           type: string
 *         required: true
 *         description: The cliente ID
 *     responses:
 *       200:
 *         description: Cliente deleted
 *       404:
 *         description: Cliente not found
 */
router.delete('/:cliente_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('cliente_id').isUUID().withMessage('Cliente ID es requerido')
    ],
    deleteCliente);

export default router;