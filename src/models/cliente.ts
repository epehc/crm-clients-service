import {DataTypes, Model} from "sequelize";
import sequelize from "../database/db";

class Cliente extends Model {}

Cliente.init(
    {
        client_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false,
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        direccion: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        persona_contacto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        telefono_persona_contacto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email_persona_contacto: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        nit: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        plazas: {
            type: DataTypes.ARRAY(DataTypes.STRING),
            allowNull: true,
        },
        saldo_pendiente: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        saldo_vencido: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        credito_por_dias: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    },
    {
        sequelize,
        modelName: "Cliente",
        tableName: "clientes",
        timestamps: false,
    }
)

export default Cliente;