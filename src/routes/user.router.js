import { Router } from "express";
import multer from 'multer';
import { saveUser, getAllUsers, getUserById, changeRoleUser, getUserForChange, getUserByEmail, goUpDocument, uploadDocumentUser, getProfile, uploadProfileUser, deleteUser} from "../controller/user.controller.js";
import { passportCall } from "../utils.js";
import { uploadProfileImage,uploadDocument } from "../config/multer.config.js";
import { isUser, isAdmin } from "./auth.router.js";

const router = Router();

// Configuración de Multer para manejar la carga de archivos
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Nuevas rutas
router.get("/",passportCall('jwt'),isAdmin, getAllUsers);//isAdmin,
router.post("/", saveUser);
router.get("/:uid",getUserById);
router.get("/premium/:uid",passportCall("jwt"), getUserForChange);
router.post("/premium/:uid",passportCall("jwt"),changeRoleUser);
router.get("/byemail/:userEmail",passportCall("jwt"),getUserByEmail)
router.get("/:uid/documents", passportCall("jwt"), goUpDocument)
router.get("/:uid/profile/", passportCall("jwt"),getProfile);
router.post("/:uid/upload-documents/", uploadDocument.single('documents'), uploadDocumentUser);
router.post('/:uid/upload-avatar/', uploadProfileImage.single('profiles'), uploadProfileUser);
router.delete("/:uid", deleteUser);

export default router;