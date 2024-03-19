import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "./db/connection";

// interface UserAttributes {
//     id: number;
//     name: string;
// }

// export interface UserInput extends Optional<UserAttributes, 'id' | 'name'> {}
// export interface UserOutput extends Required<UserAttributes> {};

export class User extends Model {
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
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});


export class Game extends Model {
    public ocId!: number;
    public name!: string;
    public ocScore!: number;
}

Game.init({
    ocId: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ocScore: {
        type: DataTypes.FLOAT,
        allowNull: false,
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});


export class Review extends Model {
    public ocId!: number;
    public ocScore!: number;
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
    }
}, {
    timestamps: false,
    sequelize: sequelize,
});