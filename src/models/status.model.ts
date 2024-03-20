import { DataTypes, Model } from "sequelize";
import sequelize from "../db/connection";

export default class Status extends Model {
    public remainingReqs!: number;
    public reqResetTime!: Date;
    public remainingSearches!: number;
    public searchResetTime!: Date;
}

Status.init({
    remainingReqs: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    reqResetTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    remainingSearches: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
    },
    searchResetTime: {
        type: DataTypes.DATE,
        allowNull: false,
    },
}, {
    timestamps: false,
    sequelize: sequelize,
});