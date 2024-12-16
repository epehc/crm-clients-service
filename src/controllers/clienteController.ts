import {Request, Response} from 'express';
import Cliente from '../models/cliente';


export const getAllClientes = async (req: Request, res: Response) => {
    try {
        const clientes = await Cliente.findAll();
        res.status(200).json(clientes);
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch clientes'});
    }
};

export const getClienteByClienteId = async (req: Request, res: Response) => {
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch cliente'});
    }
};

export const getClienteByNit = async (req: Request, res: Response) => {
    try {
        const {nit} = req.params;
        const cliente = await Cliente.findOne({where: {nit}});
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to fetch cliente'});
    }
};

export const createCliente = async (req: Request, res: Response) => {
    try {
        const cliente = await Cliente.create(req.body);
        res.status(201).json(cliente);
    } catch (error) {
        res.status(500).json({error: 'Failed to create cliente'});
    }
};

export const updateCliente = async (req: Request, res: Response) => {
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            await cliente.update(req.body);
            res.status(200).json(cliente);
        } else {
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to update cliente'});
    }
};

export const deleteCliente = async (req: Request, res: Response) => {
    try {
        const {cliente_id} = req.params;
        const cliente = await Cliente.findByPk(cliente_id);
        if (cliente) {
            await cliente.destroy();
            res.status(200).json({message: 'Cliente deleted'});
        } else {
            res.status(404).json({error: 'Cliente not found'});
        }
    } catch (error) {
        res.status(500).json({error: 'Failed to delete cliente'});
    }
};