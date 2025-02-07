import { DataTypes, Model } from "sequelize";
import sequelize from "../database/db";


class PersonaContacto extends Model {}

PersonaContacto.init(
    {
        persona_contacto_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        client_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        correo: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "PersonaContacto",
        tableName: "personas_contacto",
        timestamps: false,
    }
)

export default PersonaContacto;