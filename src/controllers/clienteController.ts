import {Request, Response} from 'express';
import Cliente from '../models/cliente';
import logger from "../utils/logger";
import {validationResult} from "express-validator";
import { error } from 'console';
import {v4 as uuidv4} from 'uuid';
import { Op } from 'sequelize';



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

export const getClientes = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 12;
        
        const offset = (page - 1) * pageSize;

        const query = req.query.query ? req.query.query.toString() : "";

        console.log("Submitted query: ", req.query);
        const whereClause = query ? {
            [Op.or]: [
                { nombre: { [Op.iLike]: `%${query}%` } },
                { nit: { [Op.iLike]: `%${query}%` } },
                { direccion: { [Op.iLike]: `%${query}%` } }
            ]
        } : {};

        const {count, rows: clientes} = await Cliente.findAndCountAll({
            where: whereClause,    
            offset,
            limit: pageSize
        });

        res.status(200).json({
            data: clientes,
            total: count,
            totalPages: Math.ceil(count / pageSize),
            currentPage: page
        });
    } catch (error) {
        logger.error('Failed to fetch clientes');
        res.status(500).json({error: 'Failed to fetch clientes'});
    }

}

export const getClienteByClienteId = async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        logger.error('Failed to validate request ', errors);
        res.status(400).json({ errors: errors.array() });
    }
    try {
        
        const client_id = req.params.client_id;
        const cliente = await Cliente.findByPk(client_id);
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
        logger.error('Failed to validate request: ', errors);
        res.status(400).json({ errors: errors.array() });
        return
    }
    try {
        const {nombre, direccion, nit, telefono, credito_por_dias} = req.body;

        const cliente = await Cliente.create({
            client_id: uuidv4(),
            nombre,
            direccion,
            nit,
            telefono,
            plazas: [],
            saldo_pendiente: 0,
            saldo_vencido: 0,
            credito_por_dias
        });
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
        const client_id = req.params.client_id;
        const updatedCliente = req.body;
        const cliente = await Cliente.findByPk(client_id);
        if (cliente) {
            await cliente.update(updatedCliente);
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
        const client_id = req.params.client_id;
        const cliente = await Cliente.findByPk(client_id);
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