import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class Status extends Model {
    public remainingReqs!: number;
    public reqResetTime!: Date;
    public remainingSearches!: number;
    public searchResetTime!: Date;
}

Status.init({
    requestsRemaining: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    requestsResetTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    searchesRemaining: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    searchesResetTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
    sequelize: sequelize,
});