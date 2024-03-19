import { Sequelize } from "sequelize-typescript";

const sequelize = new Sequelize(process.env.MYSQL_URI || "");
sequelize.authenticate();

console.log("DB Connection is working");

export default sequelize;