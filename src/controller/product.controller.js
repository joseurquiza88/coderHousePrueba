// La configuracion esta en el index que esta en el dao
// import { PRODUCTDAO } from "../dao/index.js";
// import { USERDAO } from "../dao/index.js";

import notifier from "node-notifier";
//Manejo de errores
import CustomError from "../service/CustomError.js";
import EErrors from "../service/enum.js";
import {generateProductErrorInfo} from "../service/info.js";
import {productService,userService } from "../repositories/service.js";
import { uploadProductImage } from '../config/multer.config.js';
import { sendEmailToPremium } from "../service/mailing.js";
import products from "../dao/models/product.model.js";
import productsModel from "../dao/models/product.model.js";

//Guardamos producto dependiendo si es en memoria o si es en mongo
async function createProduct(req, res){
    try {
        const productData = req.body;
        if (!productData || !productData.name || !productData.description || !productData.price || !productData.category || !productData.availability) {
            throw new CustomError(EErrors.InvalidData, "Error, los datos del producto no son válidos.")}
        //Segun profe
        //await PRODUCTDAO.save(product);
        // Establece el campo 'owner' del producto
        productData.owner = user.user.user.email;
        await productService.createProduct(productData);
        res.send(productData);
    } 
    catch (error) {
      //tema nuevo, manejo de errores
      if (error instanceof CustomError) {
        const errorInfo = generateProductErrorInfo(error);
        res.status(errorInfo.statusCode).json(errorInfo);
      } 
      else {
        res.status(500).json({ message: "Error en el servidor" });
      }
    }
  }

//obtenemos productos dependiendo si es en memoria o si es en mongo
async function getAllProducts (req, res) {
  //const products = await productService.getAllProducts();
  const userId = req.user.user.user._id;
  const profile = await userService.getUserById(userId);
  const showAvatar = profile.profileImage;
  const user = req.user;
  const cartId = req.user.user.user.cart;
  const userRole = user.user.user.role;
  const showEditProduct = userRole === 'admin' || userRole === 'premium' ? true : false;
  const showChangeRole = userRole === 'admin'  ? true : false;
  const page = parseInt(req.query.page) || 1; // Página actual, por defecto la primera
  const perPage = 4; // Número de productos por página
  const totalProducts = await productsModel.countDocuments();
  const totalPages = Math.ceil(totalProducts / perPage);

  
  const products = await productsModel.find().lean()
    .skip((page - 1) * perPage)
    .limit(perPage)
    .exec();
    
    res.render('home', {
      products: products,
      user: user, cartId: cartId, showEditProduct,showAvatar,showChangeRole,
      pagination: {
        currentPage: page,
        totalPages,
        hasPrevPage: page > 1,
        hasNextPage: page < totalPages,
        prevLink: page > 1 ? `/api/products?page=${page - 1}` : null,
        nextLink: page < totalPages ? `/api/products?page=${page + 1}` : null
      }
      
  });
 
};
  
// Obtenemos producto por ID dependiendo si es en memoria o si es en mongo
async function getProductById(req, res){
    const pid = req.params.pid;
    //const productById = await PRODUCTDAO.getById(pid);
    const productById = await productService.getProductById(pid);
    productById._id = productById._id.toString(); 
    res.render('productDetail', productById);   
}

//Generamos funcion para visualizar todos los productos por el adm, problema!! revisar
async function getAllProductsForAdmin(req, res){
  const user = req.user; 
  const products = await productService.getAllProducts();
  res.render('updateProducts', { products: products, user: user});
}

async function getProductByIdForAdmin(req, res){
    const pid = req.params.pid;
    //const productById = await PRODUCTDAO.getById(pid);
    const productById = await productService.getProductById(pid);
    productById._id = productById._id.toString(); 
    res.render ('updateIDProduct',productById)
}
// Eliminamos producto por ID dependiendo si es en memoria o si es en mongo

async function deleteProduct(req, res){
    const {pid} = req.params;
    const {user} = req;
    try {
      const productId = await productService.getProductById(pid);
      if (user.user.user.role === 'admin' || (user.user.user.role === 'premium' && productId.owner === user.user.user.email)) {
        const productDeleted = await productService.deleteProduct(pid);
        //res.send(productDelete);
        //Enviar mail de aviso de modificacion al owner
        if (user.user.user.role === 'admin' && productId.owner !== user.user.user.email) {
          await sendEmailToPremium(productId.owner); 
          console.log(`Correo enviado al administrador, por favor valide`);
        }
        notifier.notify({title: 'Cambios realizados'});
        res.send(productDeleted);
      } else {
         notifier.notify({title: 'Error', message:' No tienes permiso para eliminar el producto seleccionado'});
      }
    } catch (error) {
      res.status(500).send('Error interno del servidor.');
    }
  };
  
// Actualizamos producto por ID dependiendo si es en memoria o si es en mongo
async function updateProduct(req, res){
    const pid = req.params.pid;
    const productToUpdate = req.body;
    const productUpdated = await productService.updateProduct(pid, productToUpdate);
    notifier.notify({title: 'Exito', message: 'Producto actualizado',});
    res.send(productUpdated);
  };

  //Subir imagen del producto
  const uploadImageProduct = async (req, res) => {
    try {
      const productId = req.params.pid; 
      const imagePath = req.file.path;
      await productService.uploadProductImage(productId, imagePath);
         
      notifier.notify({message: 'La imagen del producto fue actualizada'});
         res.redirect(303, `/api/updateproducts`);
    } catch (error) {
      
      res.status(500).json({ error: 'Error interno del servidor' });
    }
     
  };
//Exportamos funciones

export {createProduct, getAllProducts, getProductById, deleteProduct, updateProduct, getAllProductsForAdmin, getProductByIdForAdmin,uploadImageProduct}


// Funcion para la 3era preentrga
//Guardamos producto dependiendo si es en memoria o si es en mongo
// async function saveProduct (req,res){
//     const product = req.body;
//     await PRODUCTDAO.save(product);
//     res.send(product)
// }