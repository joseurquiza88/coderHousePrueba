//Botones para agregar productos al carrito
document.querySelectorAll('.button-add-to-cart').forEach(button => {
  button.addEventListener('click', addToCart);
});
  function addToCart(event) {
  event.preventDefault();
  const cid = event.target.getAttribute("data-cart-id"); 
  const pid = event.target.id;
  
  fetch(`/api/carts/${cid}/product/${pid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
  .then(response => response.json())
  .then(data => console.log("Producto agregado al carrito con exito"))
  .catch(error => {
    console.log('Error:', error);
  });
}

 // Mostrar informacion sobre los productos
document.querySelectorAll('.view-details-button').forEach(button => {
button.addEventListener('click',  async (event) => {
   const productId = event.target.id;
try {
  const response = await fetch(`http://localhost:8080/api/products/${productId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  if (response.ok) {
    window.location.href = `http://localhost:8080/api/products/${productId}`;
  } else {
    throw new Error('Error, no se puede mostrar el detalle');
  }
} catch (error) {
  alert(error.message);
}

});
});