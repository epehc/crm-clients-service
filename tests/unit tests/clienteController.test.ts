import { Request, Response } from "express";
import Cliente from "../../src/models/cliente";
import {
  getClientes,
  getClienteByClienteId,
  createCliente,
  updateCliente,
} from "../../src/controllers/clienteController";
import { validationResult } from "express-validator";

jest.mock("../../src/models/cliente");
jest.mock("express-validator", () => ({
  validationResult: jest.fn(() => ({
    isEmpty: () => true,
    array: () => [],
  })),
}));

const mockResponse = {
  json: jest.fn(),
  status: jest.fn(() => mockResponse),
  send: jest.fn(),
} as unknown as Response;

beforeEach(() => {
  jest.clearAllMocks();
});

describe("getClientes", () => {
  test("should return paginated clientes successfully", async () => {
    const fakeClientes = [
      { client_id: "uuid-1", nombre: "Cliente A" },
      { client_id: "uuid-2", nombre: "Cliente B" },
    ];
    const count = fakeClientes.length;
    // Assume that getClientes calls Cliente.findAndCountAll
    jest.spyOn(Cliente, "findAndCountAll").mockResolvedValue({
      count,
      rows: fakeClientes,
    } as any);

    const req = {
      query: { page: "1", pageSize: "10", query: "" },
    } as unknown as Request;

    await getClientes(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: fakeClientes,
      total: count,
      totalPages: Math.ceil(count / 10),
      currentPage: 1,
    });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { query: {} } as unknown as Request;

    await getClientes(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

describe("getClienteByClienteId", () => {
  test("should return a cliente successfully", async () => {
    const fakeCliente = { client_id: "uuid-1", nombre: "Cliente A" };
    jest.spyOn(Cliente, "findByPk").mockResolvedValue(fakeCliente as any);

    const req = { params: { client_id: "uuid-1" } } as unknown as Request;

    await getClienteByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(fakeCliente);
  });

  test("should return 404 when cliente is not found", async () => {
    jest.spyOn(Cliente, "findByPk").mockResolvedValue(null);

    const req = { params: { client_id: "uuid-unknown" } } as unknown as Request;

    await getClienteByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Cliente not found" });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid client_id" }],
    });
    const req = { params: {} } as unknown as Request;
    await getClienteByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid client_id" }],
    });
  });
});

describe("createCliente", () => {
  test("should create a cliente successfully", async () => {
    const fakeCliente = {
      client_id: "uuid-1",
      nombre: "Cliente A",
      direccion: "Address",
      nit: "123456",
      telefono: "1234567890",
      plazas: [],
      saldo_pendiente: 0,
      saldo_vencido: 0,
      credito_por_dias: 30,
    };
    jest.spyOn(Cliente, "create").mockResolvedValue(fakeCliente as any);

    const req = {
      body: {
        nombre: "Cliente A",
        direccion: "Address",
        nit: "123456",
        telefono: "1234567890",
        credito_por_dias: 30,
      },
    } as unknown as Request;

    await createCliente(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(fakeCliente);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;
    await createCliente(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

describe("updateCliente", () => {
  test("should update a cliente successfully", async () => {
    const reqBody = { nombre: "Updated Cliente" };
    const fakeCliente: any = {
      client_id: "uuid-1",
      nombre: "Cliente A",
      update: jest.fn().mockImplementation(async (data) => {
        fakeCliente.nombre = data.nombre;
      }),
      toJSON: () => ({
        client_id: fakeCliente.client_id,
        nombre: fakeCliente.nombre,
      }),
    };

    jest.spyOn(Cliente, "findByPk").mockResolvedValue(fakeCliente);

    const req = { params: { client_id: "uuid-1" }, body: reqBody } as unknown as Request;

    await updateCliente(req, mockResponse);

    expect(fakeCliente.update).toHaveBeenCalledWith(reqBody);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    const jsonArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(jsonArg).toMatchObject({
      client_id: "uuid-1",
      nombre: "Updated Cliente",
    });
  });

  test("should return 404 if cliente is not found", async () => {
    jest.spyOn(Cliente, "findByPk").mockResolvedValue(null);

    const req = {
      params: { client_id: "uuid-unknown" },
      body: { nombre: "Updated Cliente" },
    } as unknown as Request;

    await updateCliente(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Cliente not found" });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { params: { client_id: "uuid-1" }, body: {} } as unknown as Request;
    await updateCliente(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

