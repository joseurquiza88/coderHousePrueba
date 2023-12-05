//Funcion para la sesion del login, segun profe
async function postLogin(username, password) {
  const response = await fetch("/api/session/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();
  //Si la resputesta es "aurorizado" redireccionamos a los productos
    if (result.respuesta === "Autenticado exitosamente") { 
      window.location.href = "/api/products"; 
    } else {
      window.alert('Usuario o contraseña incorrectos');
      console.log(result)

    }
  }
  const loginForm = document.getElementById("login-form");
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    postLogin(username, password)
    .then((datos) => console.log(datos));
});