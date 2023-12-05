//Actualizacion del producto que esta en el handlebars product form segun el id
const updateProductForm = document.getElementById('updateProductForm');

updateProductForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  //Obtenemos todas las variables de interes
  const pid = window.location.pathname.split('/').pop();
  const name = document.getElementById('name').value;
  const description = document.getElementById('description').value;
  const price = parseFloat(document.getElementById('price').value);
  const category = document.getElementById('category').value;
  const availability = parseInt(document.getElementById('availability').value);
  const updateProducto = { name, description, price, category, availability}//,owner};
  // Intenta realizar una solicitud al servidor para crear el producto
  try {
    const response = await fetch(`/api/updateproducts/${pid}`,  {
      method: 'PUT',// ponemos un put para poder actualizar los datos
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(updateProducto), 
    });
    // Si la respuesta es ok se actualiza el producto sino no
    if (response.ok) {
        console.log('Solicitud exitosa',updateProducto);
        window.location.href = "/api/updateproducts/"; 
      }
      else{
         // Manejar errores aquí
         throw new Error('Error: no se ha podido actualizar el producto: ');
      }
    } 
    catch (error) {
      alert("Error de red: ", error.message);
  }
});
