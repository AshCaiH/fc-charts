import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class User extends Model {
    public id!: string;
    public name!: string;
    public publisherName!: string;
}

User.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
    },
    publisherName: {
        type: DataTypes.STRING,
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});