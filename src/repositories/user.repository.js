export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }
  createUser = (user) => { 
    return this.dao.save(user)};
  getAllUsers = () => {
    return this.dao.getAll();
  };
  getUserById = (uid) => {
    return this.dao.getById(uid);
  };

  getUserIdByEmail = (email) => {
    return this.dao.getByEmail(email)};
    
  updateUser = (uid, newRole) => {
    return this.dao.update(uid, newRole)};

  deleteUser = (uid) => {
    return this.dao.delete(uid);
  };
  // Nueva funcion de perfil
  uploadProfileUser = (uid, imagePath) => {
    return this.dao.upAvatar(uid, imagePath);};
  getAvatar = (uid) => {//corroborar
    return this.dao.avatar(uid);
  };
  uploadDocument = (uid,documentType,filePath)=>{
    return this.dao.upDocument(uid,documentType,filePath)
  }
}