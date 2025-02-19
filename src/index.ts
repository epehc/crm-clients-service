/// <reference path="../node_modules/@epehc/sharedutilities/types/express.d.ts" />


import express from "express";
import bodyParser from "body-parser";
import clienteRoutes from "./routes/clienteRoutes";
import {setupSwagger} from "./utils/swagger";
import cors from "cors";
import personaContactoRoutes from "./routes/personaContactoRoutes";


const app = express();
const corsOptions = {
    origin: process.env.FRONTEND_URL, //frontend's URL
    credentials: true, // Allow credentials (cookies, headers)
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
setupSwagger(app);
app.use('/clientes', clienteRoutes);
app.use('/personas-contacto', personaContactoRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

