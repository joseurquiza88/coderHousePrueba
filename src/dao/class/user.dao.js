// Manager de usuario
//Importamos modelo de usuarios
import userModel from "../models/user.model.js";
//Exportamos clase con default con las funciones para gestionar los productos
//Clase para base de datos
export default class UserDao {
    constructor(){} //necesitamos contructo? revisar!!
    //Buscar toda la ingo
    async getAll(){
      let users = await userModel.find().lean();
        return users;
    }
    
    //Guardamos info
    async save (user) {
      let result = await userModel.create(user);
      return result;
  }
    // Filrtamos por ID
    async getById(uid){
        let result = await userModel.findById({_id:uid})
        return result;
    };
// Filrtamos por email
    async getByEmail(email){
        try {
          const user = await userModel.findOne({ email: email });
          if (user) {
            return user._id; 
          } else {
            return null; 
          }
        } catch (error) {
          throw error; 
        }
      };
    //Actualizacion de los datos ==> rol
    async update(uid, newRole){
        try {
          const result = await userModel.findByIdAndUpdate(uid, { role: newRole });
          return result;
        } catch (error) {
          throw error;
        }
      };
    async delete (uid){
      let userDelete = await userModel.findByIdAndDelete(uid);
      return userDelete;

    }

    //Funcion  actualizar la ruta de las imagenes de perfil
    async upAvatar (uid, imagePath){
        try {
          const user = await userModel.findById(uid);
          if (!user) {
            throw new Error('Error!, usuario no encontrado');
          }
          user.profileImage = imagePath;
          await user.save();
      
          return { message: 'Imagen de perfil actualizada correctamente' };
        } catch (error) {
          throw new Error('Error al actualizar imagen en la base de datos');
        }
      };

    //SUBIR DOCUMENTOS
     async upDocument (uid, documentType, filePath) {
      try {
        const user = await userModel.findById(uid);
        if (!user) {
          throw new Error('Usuario no encontrado');
        }
        user.documents.push({name: documentType,  reference: filePath});
        await user.save();
        return {success: true };
      } catch (error) {
        throw new Error('Error al subir el documento: ' , error.message);
      }
    }
      avatar= async (uid) => {
        let user = await userModel.find(uid);
        const avatar = user.profileImage;
        return avatar;
    }
  }

