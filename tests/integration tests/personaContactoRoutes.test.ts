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

import * as personaContactoController from "../../src/controllers/personaContactoController";
// Stub controller functions to simulate responses.
jest
  .spyOn(personaContactoController, "getPersonasContactoByClienteId")
  .mockImplementation(async (req, res) => {
    res.status(200).json([
      { persona_contacto_id: "uuid-1", nombre: "Test Contact", client_id: req.params.client_id },
    ]);
  });
jest
  .spyOn(personaContactoController, "createPersonaContacto")
  .mockImplementation(async (req, res) => {
    res.status(201).json({ persona_contacto_id: "uuid-new", ...req.body });
  });
jest
  .spyOn(personaContactoController, "updatePersonaContacto")
  .mockImplementation(async (req, res) => {
    if (req.params.persona_contacto_id === "uuid-1") {
      res.status(200).json({ persona_contacto_id: "uuid-1", ...req.body });
    } else {
      res.status(404).json({ error: "Persona de contacto not found" });
    }
  });


import request from "supertest";
import express from "express";
import personaContactoRoutes from "../../src/routes/personaContactoRoutes";

const app = express();
app.use(express.json());
app.use("/personas-contacto", personaContactoRoutes);


describe("PersonaContacto Routes Integration Tests", () => {
  test("GET /personas-contacto/:client_id returns personas de contacto", async () => {
    const res = await request(app).get("/personas-contacto/uuid-client");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([
      { persona_contacto_id: "uuid-1", nombre: "Test Contact", client_id: "uuid-client" },
    ]);
  });

  test("POST /personas-contacto creates a new persona de contacto", async () => {
    const newPersona = {
      nombre: "New Contact",
      telefono: "987654321",
      correo: "newcontact@example.com",
      client_id: "uuid-client"
    };
    const res = await request(app).post("/personas-contacto").send(newPersona);
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ persona_contacto_id: "uuid-new", ...newPersona });
  });

  test("PUT /personas-contacto/:persona_contacto_id updates an existing persona de contacto", async () => {
    const updateData = {
      nombre: "Updated Contact",
      telefono: "111222333",
      correo: "updated@example.com"
    };
    const res = await request(app).put("/personas-contacto/uuid-1").send(updateData);
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ persona_contacto_id: "uuid-1", ...updateData });
  });

  test("PUT /personas-contacto/:persona_contacto_id returns 404 when not found", async () => {
    const res = await request(app)
      .put("/personas-contacto/uuid-unknown")
      .send({ nombre: "Update" });
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: "Persona de contacto not found" });
  });
});