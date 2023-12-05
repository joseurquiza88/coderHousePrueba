// Manager de carts
import cartModel from "../models/cart.model.js";
import mongoose from "mongoose";

//Clase para base de datos
export default class CartDao {
  constructor() {/////
    console.log(`Mongo en CartDao `);
  }
  // --- FUNCIONES BASICAS ---
  ///Buscamos todos los carritos
  async getAll() {
    return await cartModel.find({}).lean();
  };

    //Funcion para buscar carrito segun el ID 
  async getById (cid)  {
    let result = await cartModel.findById({_id:cid});
    return result;
  };
  //Se crea el carrito por primera vez
  async save(data) {
    const newCart = await cartModel.create(data);
    return newCart
  };
 //Funcion para actualizar un carrito
  async update(id, data) {
    const updatedCart = await  cartModel.findByIdAndUpdate(id, {products:data});
    return updatedCart;
  };
  
//Funcion para poder eliminar un carrito
  async delete(id) {
    const deletedCart = await cartModel.findByIdAndDelete(id);
    return deletedCart;
  };


//Si el producto ya existe en el carrito, sumamos ==> incrementar quantity
   async incrementQuantity (cid, pid) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      const productIndex = cart.products.findIndex(
        (p) => String(p.product._id) === pid
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity += 1;
        const updatedCart = await cart.save();
  
        if (!updatedCart) {
          console.log("Error, el carrito no fue encontrado");
          return null;
        }
  
        console.log("Carrito actualizado", updatedCart);
        return updatedCart;
      } else {
        console.log("Error, producto no encontrado dentro del carrito");
        return null;
      }
    } catch (error) {
      throw new Error("Error, no hay disponibilidad del producto seleccionado")
    }
  }
  
  
// Se agrega agregar un producto al carrito
async addProduct(cid, pid) {
  try {
    const cart = await cartModel.findOne({ _id: cid });
    const productExists = cart.products.some(
      (p) => String(p.product) === pid
    );
    //Vemos si ya existe el producto
    if (!productExists) {
      const newProduct = { product: pid, quantity: 1 }; 
      cart.products.push(newProduct);
      const updatedCart = await cart.save();

      if (!updatedCart) {
        console.log("Error, el carrito no fue encontrado");
        return null;
      } 
      console.log("El carrito fue actualizado con exito", updatedCart);
      return updatedCart;
    }
  } catch (error) {
    throw new Error("Error, no se puede agregar el producto seleccionado al carrito")
  }
}
//Funcion de verificacion
async isThere(cartId, productId) {
  try {
    const cart = await cartModel.findOne({ _id: cartId});
    if (cart) {
      const productInCart = cart.products.some(
        ({product}) => String(product._id) === productId
      );
      if (productInCart) {
        return productInCart;
      } else {
        return null;
      }
    } else {
      return null;
    }
  } catch (error) {
    throw new Error("Error, no se ha encontrado el producto en el carrito");
  }
};

   //Se busca el producto en el carrito segun id y se actualiza la cantidad e
  async findProductInCartAndUpdateQuantity(cid, pid, newQuantity) {
    try {
      const cart = await cartModel.findOne({ _id: cid });
      const productIndex = cart.products.findIndex(
        (p) => String(p.product._id) === pid
      );
      if (productIndex !== -1) {
        cart.products[productIndex].quantity = newQuantity;
        const updatedCart = await cart.save();
        if (!updatedCart) {
          console.log("Error, carrito no encontrado");
          return null;
        }
        console.log("El carrito se ha actualizado con exito");
        return updatedCart;
      } else {
        console.log("Error, producto no encontrado en el carrito");
        return null;
      }
    } catch (error) {
      throw new Error("Error al incrementar la cantidad del producto");

    }
  }
 ////Funcion para eliminar un producto seleccionado. Revisar!!!
 async removeProduct(cid, pid) {
  try {
    const cart = await cartModel.findOne({ _id: cid });
    const updatedProducts = cart.products.filter(
      (p) => String(p.product._id) !== pid
    );
    cart.products = updatedProducts;
    const updatedCart = await cart.save();

    if (!updatedCart) {
      console.log("Carrito no encontrado");
      return null;
    }
    console.log("Carrito actualizado", updatedCart);
    return updatedCart;
  } catch (error) {
    throw new Error("Error al eliminar producto del carrito")
  }
}
  
}



