import express from "express";
import bodyParser from "body-parser";
import clienteRoutes from "./routes/clienteRoutes";


const app = express();

app.use(bodyParser.json());
app.use('/clientes', clienteRoutes);

const PORT = 4003;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

