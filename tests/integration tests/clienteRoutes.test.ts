jest.mock(
    "../../node_modules/@epehc/sharedutilities/middlewares/authMiddleware",
    () => ({
      authenticateJWT: (req: any, res: any, next: any) => next(),
    })
);
jest.mock(
    "../../node_modules/@epehc/sharedutilities/middlewares/authorize",
    () => ({
      authorize: () => (req: any, res: any, next: any) => next(),
    })
);

import * as clienteController from "../../src/controllers/clienteController";
// Stub controller functions to simulate responses.
jest.spyOn(clienteController, "getClientes").mockImplementation(async (req, res) => {
  res.status(200).json({
    data: [{ client_id: "uuid-1", nombre: "Test Cliente" }],
    total: 1,
    totalPages: 1,
    currentPage: 1,
  });
});

jest.spyOn(clienteController, "getClienteByClienteId").mockImplementation(async (req, res) => {
  if (req.params.client_id === "uuid-1") {
    res.status(200).json({ client_id: "uuid-1", nombre: "Test Cliente" });
  } else {
    res.status(404).json({ error: "Cliente not found" });
  }
});

jest.spyOn(clienteController, "createCliente").mockImplementation(async (req, res) => {
  res.status(201).json({ client_id: "uuid-new", ...req.body });
});

jest.spyOn(clienteController, "updateCliente").mockImplementation(async (req, res) => {
  if (req.params.client_id === "uuid-1") {
    res.status(200).json({ client_id: "uuid-1", ...req.body });
  } else {
    res.status(404).json({ error: "Cliente not found" });
  }
});


import request from "supertest";
import express from "express";
import clienteRoutes from "../../src/routes/clienteRoutes";

const app = express();
app.use(express.json());
app.use("/clientes", clienteRoutes);



describe("Cliente Routes Integration Tests", () => {
  test("GET /clientes should return paginated clientes", async () => {
    const res = await request(app)
      .get("/clientes")
      .query({ page: 1, pageSize: 12 });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      data: [{ client_id: "uuid-1", nombre: "Test Cliente" }],
      total: 1,
      totalPages: 1,
      currentPage: 1,
    });
  });

  test("GET /clientes/:client_id returns a cliente when found", async () => {
    const res = await request(app).get("/clientes/uuid-1");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ client_id: "uuid-1", nombre: "Test Cliente" });
  });

  test("GET /clientes/:client_id returns 404 when not found", async () => {
    const res = await request(app).get("/clientes/uuid-unknown");
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Cliente not found" });
  });

  test("POST /clientes creates a new cliente", async () => {
    const newCliente = {
      nombre: "New Cliente",
      direccion: "New Address",
      telefono: "123456",
      nit: "NIT-test"
    };
    const res = await request(app).post("/clientes").send(newCliente);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ client_id: "uuid-new", ...newCliente });
  });

  test("PUT /clientes/:client_id updates an existing cliente", async () => {
    const updateData = {
      nombre: "Updated Cliente",
      direccion: "Updated Address",
      telefono: "654321",
      nit: "NIT-updated"
    };
    const res = await request(app).put("/clientes/uuid-1").send(updateData);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ client_id: "uuid-1", ...updateData });
  });

  test("PUT /clientes/:client_id returns 404 for non-existing cliente", async () => {
    const res = await request(app)
      .put("/clientes/uuid-unknown")
      .send({ nombre: "Update" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Cliente not found" });
  });

});