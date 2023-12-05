import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
import { userService } from '../repositories/service.js';
//instanciamos dotenv
dotenv.config();
// transporte de nodemailer para enviar correos
const transporter = nodemailer.createTransport({
  //service:process.env.MAILING_SERVICE,
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.MAILING_USER,
    pass: process.env.MAILING_PASSWORD
  }
});

// Enviar email por inactividad
async function sendEmail(emailAddress) {
  const mailOptions = {
    from: "CoderHouseCorreo@gmail.com",//'lucianoayrala@gmail.com',
    to: emailAddress,
    subject: 'Usuario inactivo en el ecommerce',
    text: 'Tu cuenta sera eliminada en los proximos 30 dias por inactividad en el ecommerce'
  }
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Se ha enviado un corro a ${emailAddress}`);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
};

// Enviar email por modificaciones 
async function sendEmailToPremium(emailAddress) {

  const mailOptions = {
    from: "CoderHouseCorreo@gmail.com",//'lucianoayrala@gmail.com',
    to: emailAddress,
    subject: 'Eliminación de producto',
    text: 'Se ha eliminado un producto.'
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Se ha enviado un corro a ${emailAddress}`);
  } catch (error) {
    
    console.error('Error al enviar el correo:', error);
  }
}

// Eliminar usuarios inactivos y enviar correos
async function deleteInactiveUsers() {
 const limiteInactividad = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
  try {
    const usuarios = await userService.getAllUsers(); 
    const usuariosInactivos = usuarios.filter(
      user => (user.last_connection < limiteInactividad) && (user.role === 'user' || user.role === 'premium')
    );
    for (const usuario of usuariosInactivos) {
      await sendEmail(usuario.email); 
      console.log(usuario.email)
      await userService.deleteUser(usuario._id);
      console.log(`El usuario ${usuario.email} ha sido eliminado por inactividad`);
    }
  } catch (error) {
    console.error('Error al encontrar usuarios inactivos:', error);
    throw error;
  }
}

// Llamar a la función para eliminar usuarios inactivos y enviar correos
deleteInactiveUsers().catch((error) => {
  console.error('Error al eliminar usuarios inactivos:', error);});

export{ deleteInactiveUsers, sendEmailToPremium};