 // Para enviar el correo de recuperación de la cuenta
document.getElementById("restore-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;   
    fetch("/sendmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email}),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert(data.message);
        } else {
          throw new Error("No se pudo enviar el correo de recuperación");
        }
      })
      .catch((error) => {
        console.log(error)
        alert("Error al enviar la solicitud:", error.message);
        
      });
  });
// Función para enviar correos de recuperación
function enviarCorreoRecuperacion(destinatario, enlaceRecuperacion) {
    const mailOptions = {
      from: "CoderHouseCorreo@gmail.com",
      to: destinatario,
      subject: "Recuperación de Contraseña",
      text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${enlaceRecuperacion}`,
    };
    //Envio de mail
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error)
        throw new Error("Error al enviar el correo de recuperación:");
      } else {
        alert("Correo de recuperación enviado");
        console.log("Correo de recuperación enviado:", info.response);
      }
    });
  }