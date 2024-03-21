import { DataTypes, Model } from "sequelize";
import sequelize from "../../db/connection";

export default class UserGames extends Model {
    public counterpicked: boolean = false;
}

UserGames.init({
    counterpicked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
}, {
    timestamps: false,
    sequelize: sequelize,
});