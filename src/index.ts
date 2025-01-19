/// <reference path="../node_modules/@epehc/sharedutilities/types/express.d.ts" />


import express from "express";
import bodyParser from "body-parser";
import clienteRoutes from "./routes/clienteRoutes";
import {setupSwagger} from "./utils/swagger";


const app = express();

app.use(bodyParser.json());
setupSwagger(app);
app.use('/clientes', clienteRoutes);

const PORT = 4003;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

