import { Router } from "express";
import { passportCall} from "../utils.js";
import {isAdmin,isPremium, isUser} from "./auth.router.js";// es para corroborar que sea admin
import { getAllProductsForAdmin, createProduct, deleteProduct, updateProduct, getProductByIdForAdmin, uploadImageProduct} from "../controller/product.controller.js";
import { uploadProductImage } from "../config/multer.config.js";
//Iniciamso
const router = Router();
//rutas de actualizacion productos con jwt.
//Tenemos que verificar si es admin para que pueda cambiar los productos, subir nuevos o eliminar otros segun disponibilidad
//Si llega a esas rutas e sporque es admin
//se modifico verificar
router.get("/",passportCall('jwt') , getAllProductsForAdmin);
router.post ("/",passportCall('jwt') , createProduct);
router.delete("/:pid",passportCall('jwt') , deleteProduct);
router.post("/:pid",passportCall('jwt') ,updateProduct);
router.get ("/:pid",passportCall('jwt') ,getProductByIdForAdmin);
router.post('/:pid', uploadProductImage.single('products'), uploadImageProduct);//nueva para subir imagen

export default router;