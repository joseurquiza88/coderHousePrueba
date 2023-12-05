import { Router } from "express";

import { __dirname } from "../utils.js";
import { passportCall } from "../utils.js";
import * as dotenv from "dotenv";
//Desde el controller
import { createProduct, getAllProducts, getProductById, deleteProduct, updateProduct } from "../controller/product.controller.js";
//Instanciamos
const router = Router();

//Ruta que busca todos los productos con estretegia jwt
router.get("/", passportCall('jwt'), getAllProducts);
//Ruta para obtener info por id
router.get("/:pid", getProductById);

export default router;
