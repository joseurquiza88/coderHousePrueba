
// Manager de productos
//Importamos modelo del productos
import productsModel from '../models/product.model.js';
import notifier from 'node-notifier';
//Exportamos clase con default con las funciones para gestionar los productos
//Clase para base de datos
export default class ProductDao {
  constructor() {
    ////
}
    // Buscamos todos los productos
  async getAll() {
    let products = await productsModel.find({}).lean();
    return products;
  }
  // Guardamos datos
  async create(product) { //save
    const newProduct = await productsModel.create(product);
    return newProduct;
  };
  //Actualizamos productos
  async update(pid, data) {
    const updateProduct = await productsModel.findByIdAndUpdate(pid, data, { new: true });
    return updateProduct;
  };
  //Eliminamos producto
  async delete(id) {
    const deleteProduct = await productsModel.findByIdAndDelete(id);
    return deleteProduct;
  };
// Buscamos un producto por ID
  async getById(id) {
      let productID = await productsModel.findById(id);
      return productID
  };
  // Buscamos un producto por categoria
  async getByCategory(filter) {
    const products = await productsModel.find()
    const productsByCategory = products.filter(
      (p) => String(p.category) == filter
   );
   return productsByCategory;
}
 // Buscamos un producto por disponibilidad
async getByAvailability(filter) {
  try {
    const products = await productsModel.find();
    const productsAvailability = products.filter(
      (p) => String(p.availability) == filter
    );
    if (productsAvailability.length > 0){ 
        return productsAvailability;
    }else{
     console.error("Faltante de stock");
    }
    } catch (error) {
    console.error("Error al obtener productos por falta de disponibilidad", error);
    throw error;
    }
  }
  //Ruta para subir imagen
  async upImage (pid, imagePath) {
    try {
      const product = await productsModel.findById(pid);
      if (!product) {
        throw new Error('Producto no encontrado');
      }
      product.productImage = imagePath;
      await product.save()
      return { message: 'Ruta de la imagen actualizada' };
    } catch (error) {
      throw new Error('Error, no se ha encontrado la ruta');
    }
  };

}