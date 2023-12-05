// La configuracion esta en el index que esta en el dao

// import { CARTDAO } from "../dao/index.js";
// import { TICKETDAO } from "../dao/index.js";
// import { PRODUCTDAO } from "../dao/index.js";

import notifier from "node-notifier";//notificaciones
// Error
import CustomError from "../service/CustomError.js";
import EErrors from "../service/enum.js";
import { updateCartErrorInfo } from "../service/info.js";

import { cartService,  productService, ticketService } from "../repositories/service.js";

// Guardamos carrito
async function saveCart(req, res){
    const cart = req.body;
    //await CARTDAO.save(cart);
    await cartService.createCart(cart);
    res.send(cart)
}

//Todos los carritos
async function getAllCarts(req, res){
    //const carts = await CARTDAO.getAll();
    const carts = await cartService.getAllCarts();
    res.render ('cart',{carts:carts}) //render
}

//Carrito por id
const getCartById = async (req, res) => {
  const cid = req.params.cid;
  const cartById = await cartService.getCartById(cid);
  cartById._id = cartById._id.toString();
  let newCart = {
    _id: cartById._id,
    products: cartById.products.map((product) => {
      return {
        _id: product.product._id,
        name: product.product.name,
        description: product.product.description,
        price: product.product.price,
        category: product.product.category,
        availability: product.product.availability,
        quantity: product.quantity,
      };
    }),
    total: cartById.total,
  };
  res.render("cart", newCart);
};

//Actualizacion del carrito
async function updateCart(req, res){
  const cid = req.user.user.user.cart;
  const pid = req.params.pid;
  const role = req.user.user.user.role;
  const email = req.user.user.user.email;
  try {
    const product = await productService.getProductById(pid);
    //Verificacion del rol y del generador del producto
    if (role === 'premium' && product.owner === email) {
      notifier.notify({title: 'Error', message: 'El producto no puede ser agregado al carrito'});
      return;
     } 
     else {
      const productInCart = await cartService.isProductInCart(cid, pid);
      console.log("productInCart",productInCart)
      //Si el producto ya se encuentra en la lista, se deben agregar unidades al stock
      if (productInCart) {
        notifier.notify({title: 'Operacion exitosa'});
        return cartService.incrementProductQuantity(cid, pid);
      } else {
        notifier.notify({title: 'Operacion exitosa'});
        return cartService.addProductToCart(cid, pid);
      }
    }
  } catch (error) {
    throw new Error("Error al agregar producto");
  }
};
// Funcion para generar numeros aleatorios de tickets
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
//Generamos los tkets
async function generatedTicket(req,res){
    const user =  req.user;
    const cid = req.params.cid;
    //const cart = await CARTDAO.getCartId(cid);
    const cart = await cartService.getCartById(cid);
    const randomCode = getRandomInt(10000, 99999); //valores random de la funcion anterior
    //generamos ticket
    const newTicket = {
        code: randomCode,
        purchase_datetime: new Date(),
        amount: cart.total,
        purchaser: user.user.user.email
    }
    // const ticket = TICKETDAO.newTicket(newTicket)
    const ticket = ticketService.createTicket(newTicket);
    const productsNotPurchased = [];//lista vacio
    // Recorre los productos en el carrito
    for (const item of cart.products) {
      const productId = item.product;
      const quantity = item.quantity;
      // Vemos la disponibilidad dle producto
      const product = await productService.getProductById(productId);
      if (!product) {
        productsNotPurchased.push({ productId, response: "Error, producto inexistente" });
        continue; 
      }
      if (product.availability < quantity) {
        productsNotPurchased.push({ productId, response: "Error, no hay stock disponible del producto seleccionado" });
        continue; 
      }
      // Eliminamos las unidades del producto seleccionado en la base de daros
      product.availability -= quantity;
      // Guarda la actualización en la base de datos
      await productService.updateProduct(productId,product);
      // Elimina el producto comprado del carrito
      await cartService.removeProductFromCart(cid, product.id);
    
    }
    res.send( ticket)
}


const deleteCart = async (cartId) => {
  try {
    const cart = await cartService.getCartById(cartId);
    if (!cart) {
      throw new Error("Carrito seleccionado inexistente");
    }
    await cartService.deleteCart(cartId);
  } catch (error) {
    throw new Error("Error al eliminar el carrito");
  }
};

export { saveCart, getAllCarts, getCartById, updateCart, generatedTicket, deleteCart };


//3era Preentrega 
//Actualizamos carrito
// async function updateCart(req,res){
//     const cid = req.user.user.user.cart;
//     const pid = req.params.pid;
//     const updateCart = await CARTDAO.addProductToCart(cid, pid);
//     //console.log(updateCart);
//     res.send(updateCart)
   
// }