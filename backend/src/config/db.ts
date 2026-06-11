import mysql from 'mysql2/promise';
import 'dotenv/config';
export const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD_DB,
    database: process.env.DATABASE,
    port: Number(process.env.PORT_DB)
});