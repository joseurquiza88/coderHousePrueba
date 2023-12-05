//Constructor DTO
export default class UserDTO {
    constructor(user) {
      this.first_name = user.user.user.first_name;
      this.last_name = user.user.user.last_name;
      this.email = user.user.user.email;
      this.role = user.user.user.role;
    }
  }
  //Creacion usuario DTO
  export function createUserDTO(reqUser) {
    //if (!reqUser || !reqUser.user || !reqUser.user.user) {
    if (!reqUser || !reqUser.first_name || !reqUser.email) {
      return null
    }
    const userDTO = new UserDTO(reqUser); 
    return userDTO;
  }
  