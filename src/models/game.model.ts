import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class Game extends Model {
    public id!: string;
    public ocId!: number;
    public name!: string;
    public ocScore!: number;
    public skipReviews!: number;
    public releaseDate!: Date;
    public lastChecked!: Date;
    public lastUpdated!: Date;
}

Game.init({
    id: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    ocId: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    name: {
        type: DataTypes.STRING,
        unique: true,
    },
    skipReviews: {
        type: DataTypes.INTEGER.UNSIGNED,
        defaultValue: 0,
    },
    ocScore: {
        type: DataTypes.FLOAT.UNSIGNED,
    },
    releaseDate: {
        type: DataTypes.DATE
    },
    lastChecked: {
        type: DataTypes.DATE
    },
    lastUpdated: {
        type: DataTypes.DATE
    },
}, {
    timestamps: false,
    sequelize: sequelize,
});
