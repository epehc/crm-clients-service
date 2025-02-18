import { Request, Response } from "express";
import PersonaContacto from "../../src/models/personaContacto";
import {
  getPersonasContactoByClienteId,
  createPersonaContacto,
  updatePersonaContacto,
} from "../../src/controllers/personaContactoController";
import { validationResult } from "express-validator";

jest.mock("../../src/models/personaContacto");
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

describe("getPersonasContactoByClienteId", () => {
  test("should return personas de contacto successfully", async () => {
    const fakePersonas = [
      { persona_contacto_id: "uuid-1", nombre: "Contacto A", client_id: "client-1" },
      { persona_contacto_id: "uuid-2", nombre: "Contacto B", client_id: "client-1" },
    ];
    jest.spyOn(PersonaContacto, "findAll").mockResolvedValue(fakePersonas as any);

    const req = { params: { client_id: "client-1" } } as unknown as Request;

    await getPersonasContactoByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(fakePersonas);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid client_id" }],
    });
    const req = { params: {} } as unknown as Request;

    await getPersonasContactoByClienteId(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid client_id" }],
    });
  });
});

describe("createPersonaContacto", () => {
  test("should create a persona de contacto successfully", async () => {
    const fakePersona = {
      persona_contacto_id: "uuid-1",
      nombre: "Contacto A",
      telefono: "123456789",
      correo: "contacto@example.com",
      client_id: "client-1",
    };
    jest.spyOn(PersonaContacto, "create").mockResolvedValue(fakePersona as any);

    const req = {
      body: {
        nombre: "Contacto A",
        telefono: "123456789",
        correo: "contacto@example.com",
        client_id: "client-1",
      },
    } as unknown as Request;

    await createPersonaContacto(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(fakePersona);
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { body: {} } as unknown as Request;

    await createPersonaContacto(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});

describe("updatePersonaContacto", () => {
  test("should update persona de contacto successfully", async () => {
    const reqBody = { nombre: "Updated Contact" };
    const fakePersona: any = {
      persona_contacto_id: "uuid-1",
      nombre: "Contacto A",
      update: jest.fn().mockImplementation(async (data) => {
        fakePersona.nombre = data.nombre;
      }),
      toJSON: () => ({
        persona_contacto_id: fakePersona.persona_contacto_id,
        nombre: fakePersona.nombre,
      }),
    };

    jest.spyOn(PersonaContacto, "findByPk").mockResolvedValue(fakePersona);

    const req = { params: { persona_contacto_id: "uuid-1" }, body: reqBody } as unknown as Request;

    await updatePersonaContacto(req, mockResponse);

    expect(fakePersona.update).toHaveBeenCalledWith(reqBody);
    expect(mockResponse.status).toHaveBeenCalledWith(200);

    const jsonArg = (mockResponse.json as jest.Mock).mock.calls[0][0];
    expect(jsonArg).toMatchObject({
      persona_contacto_id: "uuid-1",
      nombre: "Updated Contact",
    });
  });

  test("should return 404 if persona de contacto is not found", async () => {
    jest.spyOn(PersonaContacto, "findByPk").mockResolvedValue(null);

    const req = {
      params: { persona_contacto_id: "uuid-unknown" },
      body: { nombre: "Updated Contact" },
    } as unknown as Request;

    await updatePersonaContacto(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({ error: "Persona de contacto not found" });
  });

  test("should return 400 if validation fails", async () => {
    (validationResult as unknown as jest.Mock).mockReturnValueOnce({
      isEmpty: () => false,
      array: () => [{ msg: "Invalid input" }],
    });
    const req = { params: { persona_contacto_id: "uuid-1" }, body: {} } as unknown as Request;

    await updatePersonaContacto(req, mockResponse);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      errors: [{ msg: "Invalid input" }],
    });
  });
});