// Cambiar el rol usuario-admin
document.querySelectorAll('.change-role-button').forEach(button => {
  button.addEventListener('click', moveToChangeRole);
});
function moveToChangeRole(event) {
  event.preventDefault();
  const userId = event.target.id;
  fetch(`/api/users/premium/${userId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  })
  .then(response => {
      //Si la respuesta es valida, redireccion sino lanzamos error
      if (response.ok) {
        window.location.href = `/api/users/premium/${userId}`;
      } 
      else {
        throw new Error('Error al intentar modificar el rol');
      }
    })
    .catch(error => {
      alert(error.message);
    });
  }
  
  //Formulario para cambiar el rol
  const changeUserForm = document.getElementById('update-role-user-form');
  changeUserForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Rol seleccionado en el formulario
    const newRole = document.getElementById('newRole').value.toString();
    // Guardamos email del formulario
    const userEmail = document.getElementById('userEmail').value;
    // Realiza una solicitud GET para obtener el ID del usuario por correo electrónico
    try {
      const response = await fetch(`/api/users/byemail/${userEmail}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      //Cambio del rol si la respuesta es favorable ==> premium
      if (response.ok) {
        const userId = await response.json();
        const updateResponse = await fetch(`/api/users/premium/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ newRole }),
        });
  
        if (updateResponse.ok) {
          console.log('Cambio de rol exitoso', newRole);
          // Borra los campos de entrada estableciendo sus valores en cadena vacía
          document.getElementById('newRole').value = '';
          document.getElementById('userEmail').value = '';
        } else {
          throw new Error('Error: no se pudo actualizar el nuevo rol del usuario:');
        }
      } 
      else {
        throw new Error('Error: ID del usuario incorrecto:');
      }
    } catch (error) {
      console.error('Error de red:', error);
    }
  });

//Eliminacion de usuario
  document.querySelectorAll('.button-delete-user').forEach(button => {
    button.addEventListener('click', deleteUser);
  });
    function deleteUser(event) {
    event.preventDefault();
    const uid = event.target.id;
    fetch(`/api/users/${uid}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log("Usuario eliminado");
      window.location.reload();
    })
    .catch(error => {
      console.log('Error:', error);
    });
  }