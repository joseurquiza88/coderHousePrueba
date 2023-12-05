  //Funcion para Sign up segun profe
  async function postSignup(first_name, last_name, age, username, password) {
    const data = {first_name, last_name,age, email: username, password};//email ==>username
    
    const response = await fetch("/api/session/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result  = await response.json();
     // Si la respusta es ok redireccionamos, sino mostramos error
     if (result .respuesta === "ok") {
      window.location.href = "/"; 
    } 
    else {
      console.log(result )
      throw new Error('Error'); 
      
    }}
  
  const signupForm = document.getElementById("signup-form");
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const first_name = document.getElementById("first_name").value;
    const last_name = document.getElementById("last_name").value;
    const age = document.getElementById("age").value;
  
    postSignup(first_name, last_name, age, username, password).then((datos) =>
      console.log("Datos del nuevo usuario",datos)
    );
  });