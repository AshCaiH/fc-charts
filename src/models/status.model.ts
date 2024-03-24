import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class Status extends Model {
    public requestsRemaining!: number;
    public requestsResetTime!: Date;
    public searchesRemaining!: number;
    public searchesResetTime!: Date;
}

Status.init({
    requestsRemaining: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    requestsResetTime: {
        type: DataTypes.DATE,
    },
    searchesRemaining: {
        type: DataTypes.INTEGER.UNSIGNED,
    },
    searchesResetTime: {
        type: DataTypes.DATE,
    },
}, {
    timestamps: false,
    sequelize: sequelize,
});