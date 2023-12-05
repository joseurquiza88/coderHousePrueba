// La configuracion esta en el index que esta en el dao
import multer from 'multer';
import notifier from 'node-notifier';
import { userService } from "../repositories/service.js";
import { createUserDTO } from "../DTO/userDTO.js"; 
//Guardamos usuarios dependiendo si es en memoria o si es en mongo

async function saveUser (req, res){
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res.status(400).json({status: "Error", error: "Faltan datos, completar"});
    }
    try {
      // Crear un nuevo usuario
      const newUser = new User({ first_name, last_name,  email, age, password});
      // Carrito vacío para el nuevo usuario
      const newCart = new Cart();
      await newCart.save();
      newUser.cart = newCart._id;
      // Rol predeterminado como 'user'
      newUser.role = 'user';
      const userCreated = await userService.createUser(newUser);
      res.status(201).json({status: "success", message: "Usuario creado exitosamente", user: userCreated});
    } catch (error) {
      //console.error(error);
      res.status(500).json({status: "error", error: "Error al crear usuario"});
    }
  };


//obtenemos usuarios 
async function getAllUsers(req,res){
  try {
    const allUsers = await userService.getAllUsers(); 
    const userDTOs = allUsers.map(users => createUserDTO(users));
    res.render('allUsers', { users: userDTOs });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
  }
};

//obtenemos 1 usuario segun ID d
async function getUserById(req,res){
    const uid = req.params.uid;
    const userId = await userService.getUserById(uid);
    res.send (userId)
}

//obtenemos 1 usuario segun ID para cambiar el rol
async function getUserForChange (req, res){
    const uid = req.params.uid;
    const userId = await userService.getUserById(uid);
    const users = await userService.getAllUsers(); 
    //res.render ('changeRol',{userID})
    res.render ('changeRol',{userId:userId, users:users})
  }
  
//Cambiar rol== 
async function changeRoleUser (req, res){
    const uid = req.params.uid;
    const {newRole} = req.body;
    // Obtener información sobre la carga de documentos del usuario
    const user = await userService.getUserById(uid);
    console.log("changeRoleUser  desde user controller",user)
   // Documentos requeridos
    const requiredDocuments = ['identification', 'addressProof', 'bankStatement'];
    const hasRequiredDocuments = requiredDocuments.every(documentType =>
    user.documents.some(document => document.name === documentType)
   );
   if (hasRequiredDocuments) {
     // Cambiar el rol del usuario solo si ha cargado los documentos
     const updatedUser = await userService.updateUser(uid, newRole);
     notifier.notify({title: 'Cambio exitoso', message: 'Rol modificado'});
      res.send (updatedUser)
    } else {
      notifier.notify({title: 'Error', message: 'Por favor adjuntar informacion requerida'});
  }
  }
  //Obtener usuario por email
async function getUserByEmail (req, res){
    const email = req.params.userEmail;
    const userId = await userService.getUserIdByEmail(email);
    res.send (userId)
  }
  
 
  
// Funcion para generar el perfil y renderizarlo
async function getProfile(req,res){
  const userId = req.params.uid;
  const profile = await userService.getUserById(userId);
  res.render('profile',profile)
};
 
  //subir documentos y renderizar
  async function goUpDocument (req, res){
    const uid = req.params.uid;
    const userId = await userService.getUserById(uid);
    res.render ('upDocuments',{userId})//Falta!!!
  };
  //Funcion para guardar los documentos
  async function uploadDocumentUser (req, res) {
    try {
      const userId = req.params.uid;
      const documentType = req.body.documentType; 
      if (!req.file) {
        return res.status(400).json({ error: 'Por favor, selecciona un archivo.' });
      }
      const filePath = req.file.path;
      await userService.uploadDocument(userId, documentType, filePath);
  
      notifier.notify({ message: 'Tu documento fue cargado con exito'   });
  
      res.redirect(303, `/api/users/${userId}/profile`);
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  };
//Funcion para guardar imagen del avatar del perfil

async function uploadProfileUser (req, res){
  try {
    const userId = req.params.uid; 
    const imagePath = req.file.path; 
    await userService.uploadProfileUser(userId, imagePath);
    notifier.notify({title: 'Tu perfil', message: 'Imagen agregada con exito'});
    res.redirect(303, `/api/users/${userId}/profile`);
  } catch (error) {
    res.status(500).json({ error: 'Error al subir la imagen de perfil' });
  }
   
};

async function deleteUser (req, res){
  const userId = req.params.uid;
  const usertodelete = await userService.deleteUser(userId);
  notifier.notify({ message: 'Usuario eliminado con exito'});
  return;
}

export {saveUser, getAllUsers, getUserById,getUserForChange,changeRoleUser, getUserByEmail,   getProfile, goUpDocument, uploadDocumentUser,uploadProfileUser, deleteUser }



