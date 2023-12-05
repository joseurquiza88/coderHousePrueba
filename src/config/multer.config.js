//iniciamos multer
import multer from 'multer';
import path from 'path';
import dotenv from "dotenv";
import { __dirname } from '../utils.js';


function storage(folderName) {
  return multer.diskStorage({
    destination: function (req, file, cb) {
      if (folderName === 'profiles') {
        const uploadPath = ('./public/uploadData/profiles/' );
        cb(null, uploadPath);
      } else if (folderName === 'products') {
        const uploadPath = ('./public/uploadData/products/' );
        cb(null, uploadPath);
      } else if (folderName === 'documents') {
        const uploadPath = ('./public/uploadData/documents/' );
        cb(null, uploadPath);
      } else {
        cb(new Error('El tipo de archivo ingresado no es válido, por favor revise'));
      }
    },
    //Archivos
    filename: function (req, file, cb) {
      let uniqueFilename;
      const userId = req.params.uid ; 
      const documentType = req.body.documentType ;

      if (folderName === 'products') {
        uniqueFilename = `${userId}_${file.originalname}`;
      } else {
        uniqueFilename = `${userId}_${documentType}_${file.originalname}`;
      }
      cb(null, uniqueFilename);
    },
  });
}

// Configuración de multer para subir diferentes tipos de archivos a diferentes carpetas
export const uploadProfileImage = multer({ storage: storage('profiles') });
export const uploadProductImage = multer({ storage: storage('products') });
export const uploadDocument = multer({ storage: storage('documents') });