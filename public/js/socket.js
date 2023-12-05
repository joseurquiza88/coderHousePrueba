//Generamos el chatbox con socket io
//Instanciamos socket
const socket = io();
//Conexion al socket
socket.on('connection', () => {
  console.log('Nuevo usuario conectado');
  // Enviar un mensaje al servidor
  socket.emit('mensaje', 'Nuevo usuario conectado');
});

// Escuchar el evento desde el servidor
socket.on('mensaje', (message) => {
  const messageList = document.getElementById('message-list');
  const messageItem = document.createElement('li');
  messageItem.textContent = message;
  messageList.appendChild(messageItem);
});

const input = document.getElementById('message-input');
const buttonSocket = document.getElementById('send-button');

// Enviar mensaje
buttonSocket.addEventListener('click', () => {
  const message = input.value;
  // Si se ingresa un mensaje y se envia con un click ==> enviar el mensaje al servidor
  if (message) {
    socket.emit('mensaje', message); 
    input.value = '';
  }
});