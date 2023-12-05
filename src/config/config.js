//En este archivo definimos si usamos persistencia en archivo o en base de datos
//export const PERSISTENCE = "MEMORY";
//export const PERSISTENCE = "MONGO";

//Se relaciona con el arvhico env. Ahi es donde estan todos los datos
import dotenv from "dotenv";
dotenv.config();
//Persistencia en memoria o en base de datos. Siempre intentamos en base de datos
export const PERSISTENCE = process.env.PERSISTENCE || "MONGO";
export default {
  app:{
    ENV: process.env.NODE_ENV || "production",// entorno de produccion
  },
  //Datos de mail para restablecer contraseña y otra info
  mailing: {
    SERVICE: process.env.MAILING_SERVICE,
    USER: process.env.MAILING_USER,
    PASSWORD: process.env.MAILING_PASSWORD,
  },
  //Datos de la base de datos
  mongo: {
    URL: process.env.MONGO_URI,
  },
  //Datos de la estrategia JWT para la proteccion de la sesion, cookies, otras
  jwt: {
    COOKIE: process.env.JWT_COOKIE,
    SECRET: process.env.JWT_SECRET,
  },
};