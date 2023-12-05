import mongoose from "mongoose";

const userCollection = "users";

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, max: 100 },
  last_name: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique: true },
  password: { type: String, required: true, max: 100 },
  age: { type: Number, required: true, max: 100 },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Carts' },
  role: { type: String, default: 'user' },
  last_connection: { type: Date, default:null },
  profileImage: {type: String, default: 'public/uploadData/profile/avatarPerro.jpg'}, // Ruta de la imagen de perfil
  documents: [{name: String, reference: String}]
});

const User = mongoose.model(userCollection, userSchema);

export default User;