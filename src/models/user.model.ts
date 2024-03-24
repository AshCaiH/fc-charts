import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class User extends Model {
    public id!: number;
    public name!: string;
}

User.init({
    id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    publisherName: {
        type: DataTypes.STRING,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});