import {Request, Response} from 'express';
import Cliente from '../models/cliente';
import logger from "../utils/logger";
import {validationResult} from "express-validator";



export const getAllClientes = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const clientes = await Cliente.findAll();
        logger.info('Clientes fetched');
        res.status(200).json(clientes);
    } catch (error) {
        logger.error('Failed to fetch clientes');
        res.status(500).json({error: 'Failed to fetch clientes'});
    }
};

export const getClienteByClienteId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            logger.info('Cliente fetched');
            res.status(200).json(cliente);
        } else {
            logger.error('Cliente not found');
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        logger.error('Failed to fetch cliente');
        res.status(500).json({error: 'Failed to fetch cliente'});
    }
};

export const getClienteByNit = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {nit} = req.params;
        const cliente = await Cliente.findOne({where: {nit}});
        if (cliente) {
            logger.info('Cliente fetched');
            res.status(200).json(cliente);
        } else {
            logger.error('Cliente not found');
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch cliente'});
    }
};

export const createCliente = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const cliente = await Cliente.create(req.body);
        logger.info('Cliente created');
        res.status(201).json(cliente);
    } catch (error) {
        logger.error('Failed to create cliente');
        res.status(500).json({error: 'Failed to create cliente'});
    }
};

export const updateCliente = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            await cliente.update(req.body);
            logger.info('Cliente updated');
            res.status(200).json(cliente);
        } else {
            logger.error('Cliente not found');
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        logger.error('Failed to update cliente');
        res.status(500).json({error: 'Failed to update cliente'});
    }
};

export const deleteCliente = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request');
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            await cliente.destroy();
            logger.info('Cliente deleted');
            res.status(200).json({message: 'Cliente deleted'});
        } else {
            logger.error('Cliente not found');
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        logger.error('Failed to delete cliente');
        res.status(500).json({error: 'Failed to delete cliente'});
    }
};