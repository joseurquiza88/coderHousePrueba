//funcion para manejar el "forgot password" con post
async function postForgot(username, newPassword) {
    const response = await fetch("/api/session/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, newPassword }),
    });
    const result = await response.json();
    return result;
  }
  //Buscamos id en el formulario
  const loginForm = document.getElementById("forgot-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const newPassword = document.getElementById("newPassword").value;
    const newTwoPassword = document.getElementById("newTwoPassword").value;
    if (newPassword !== newTwoPassword) {
      alert("Las contraseñas no coinciden");
    } 
    else {
      postForgot(username, newPassword)//cambio de contraseña
        .then((datos) => alert("Contraseña cambiada exitosamente", datos.respuesta))
        .catch((err) => alert("Contraseña incorrecta, por favor validar"));
      }
    });