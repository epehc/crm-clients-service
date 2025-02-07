import { authenticateJWT } from "@epehc/sharedutilities/middlewares/authMiddleware";
import { authorize } from "@epehc/sharedutilities/middlewares/authorize";
import express from "express";
import { createPersonaContacto, deletePersonaContacto, getPersonasContactoByClienteId } from "../controllers/personaContactoController";
import { UserRole } from "@epehc/sharedutilities/enums/userRole";
import { body, param } from "express-validator";



const router = express.Router();


/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: API for managing clientes
 */


router.get('/:client_id', 
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        param('client_id').isUUID().withMessage('Invalid UUID')
    ],
    getPersonasContactoByClienteId
);

router.post('/',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        body('nombre').isString().withMessage('Invalid string'),
        body('telefono').isString().withMessage('Invalid string'),
        body('correo').isEmail().withMessage('Invalid email'),
        body('client_id').isString().withMessage('Invalid string')
    ],
    createPersonaContacto
);

router.delete('/:persona_contacto_id',
    authenticateJWT,
    authorize([UserRole.Admin]),
    [
        body('persona_contacto_id').isUUID().withMessage('Invalid UUID')
    ],
    deletePersonaContacto
);

export default router;