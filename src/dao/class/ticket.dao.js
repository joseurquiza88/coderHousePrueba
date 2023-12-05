// Manager de tickets
//Importamos modelo de tickets
import ticketModel from '../models/ticket.model.js';

//Exportamos clase con default con las funciones para gestionar los productos
//Clase para base de datos
export default class TicketDao {
//Obtenemos todos los datos
constructor() {
}
  async getAll() {
    let allTickets = await ticketModel.find({}).lean();
    return allTickets;
  }
//Guardamos info, creamos data
  async save(data) {
    const ticket = await ticketModel.create(data);
    return ticket;
  };
//Actualizamos info el id/tid
  async update(tid, data) {
    const updateTicket = await ticketModel.findByIdAndUpdate(tid, data, {new : true});
    return updateTicket;
  };
//Eliminamos info
  async delete(tid) {
    const deleteTicket = await ticketModel.findByIdAndDelete(tid);
    return deleteTicket;
  };
  //Obtenemos datos por id de interes
  async getById(tid) {
    let ticketID = await ticketModel.findById(tid);
    return ticketID;
}; 
  //Nuevo ticket generamos ticket
  async getByEmail(userEmail) {
    let ticketEmail = await ticketModel.findOne({ purchaser : userEmail });
    return ticketEmail;
};

}