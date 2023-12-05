//Configuracion del logout
//import {error} from "winston";
import {cartService, userService} from "../repositories/service.js";
//sesion - Logout
async function logoutSession(req, res){
  try {
    const cartID = req.user.user.user.cart;
    // Buscar usuario
     const user = req.user;
    // Actualizar la conexion antes de destruir la sesión
    user.last_connection = new Date();
    await userService.updateUser();
    // Eliminar el carrito de compras
    await cartService.deleteCart(cartID);
    // Destruir la sesión
    req.session.destroy(error => {
      if (error) {
        return res.status(500).json({ respuesta: "Error al cerrar sesión:" });
      }
      else {
        // Limpiar el token y cerrar sesión
        res.clearCookie("CoderKeyQueNadieDebeSaber");
        res.redirect("/");
      }
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Error al cerrar sesión" });
  }
};
export {logoutSession};