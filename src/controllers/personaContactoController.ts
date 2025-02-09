import {Request, Response} from 'express';
import { validationResult } from "express-validator";
import logger from "../utils/logger";
import PersonaContacto from '../models/personaContacto';
import {v4 as uuidv4} from 'uuid';


export const getPersonasContactoByClienteId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const client_id = req.params.client_id
        const personasContacto = await PersonaContacto.findAll({where: {client_id}});
        logger.info('Personas de contacto fetched');
        res.status(200).json(personasContacto);
    } catch (error) {
        logger.error('Failed to fetch personas de contacto');
        res.status(500).json({error: 'Failed to fetch personas de contacto'});
    }
}

export const createPersonaContacto = async (req: Request, res: Response) => {
    console.log("Request body: ", req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request: ', errors);
        console.log("Errors: ", errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {nombre, telefono, correo, client_id} = req.body;
        const personaContacto = await PersonaContacto.create({
            persona_contacto_id: uuidv4(),
            nombre,
            telefono,
            correo,
            client_id
        });
        logger.info('Persona de contacto created');
        res.status(201).json(personaContacto);
    } catch (error) {
        logger.error('Failed to create persona de contacto: ', error);
        res.status(500).json({error: 'Failed to create persona de contacto'});
    }
}

export const updatePersonaContacto = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const persona_contacto_id = req.params.persona_contacto_id;
        const updatedPersonaContacto = req.body;
        const personaContacto = await PersonaContacto.findByPk(persona_contacto_id);
        if (personaContacto) {
            await personaContacto.update(updatedPersonaContacto);
            logger.info('Persona de contacto updated');
            res.status(200).json(personaContacto);
        } else {
            logger.error('Persona de contacto not found');
            res.status(404).json({error: 'Persona de contacto not found'});
        }
    } catch (error) {
        logger.error('Failed to update persona de contacto');
        res.status(500).json({error: 'Failed to update persona de contacto'});
    }
} 


export const deletePersonaContacto = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const persona_contacto_id = req.params.persona_contacto_id;
        const personaContacto = await PersonaContacto.findByPk(persona_contacto_id);
        if (personaContacto) {
            await personaContacto.destroy();
            logger.info('Persona de contacto deleted');
            res.status(204).send();
        } else {
            logger.error('Persona de contacto not found');
            res.status(404).json({error: 'Persona de contacto not found'});
        }
    } catch (error) {
        logger.error('Failed to delete persona de contacto');
        res.status(500).json({error: 'Failed to delete persona de contacto'});
    }
}