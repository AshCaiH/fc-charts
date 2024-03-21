import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class Review extends Model {
    public ocId!: number;
    public ocScore!: number;
    public date!: Date;
}

Review.init({
    ocId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    ocScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});