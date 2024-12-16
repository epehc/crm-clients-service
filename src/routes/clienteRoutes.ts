import express from "express";
import {body, param} from "express-validator";
import {
    getAllClientes,
    getClienteByClienteId,
    getClienteByNit,
    createCliente,
    updateCliente, deleteCliente
} from "../controllers/clienteController";

const router = express.Router();

router.get('/', getAllClientes);
router.get('/:cliente_id', getClienteByClienteId);
router.get('/nit/:nit', getClienteByNit);
router.post(
    '/',
    [
        body('cliente_id').isUUID(),
        body('nombre').isString(),
        body('nit').isString(),
        body('direccion').isString(),
        body('telefono').isString(),
        body('correo').isEmail(),
    ],
    createCliente
);
router.put(
    '/:cliente_id',
    [
        param('cliente_id').isUUID(),
        body('nombre').optional().isString(),
        body('nit').optional().isString(),
        body('direccion').optional().isString(),
        body('telefono').optional().isString(),
        body('correo').optional().isEmail(),
    ],
    updateCliente
);

router.delete('/:cliente_id', deleteCliente);

export default router;