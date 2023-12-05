import supertest from 'supertest';
import chai from 'chai';

//   ---------    CARTS TEST    --------- 
//Inicializamos
const expect = chai.expect;
const requester = supertest('http://localhost:8080');


describe('Pruebas para evaluar el segmento de carrito', () => {
    //01. Test de Creacion de carrito del usuario
  it('Retorna el carrito del usuario segun ID', async () => {
    //Numero de ID
    const userId = 1;
    // Creacion del carrito
    const response = await requester.get(`/carts/${userId}`);
    expect(response.status).to.equal(200);
    // El carrito creado tiene que ser de tipo objeto, tiene que incluir toda la info ingresada
    expect(response.body).to.be.an('object');
    
  });

  
  //02. Test para agregar producto al carrito
  it('Agrega un producto al carrito segun ID del usuario', async () => {
    //Numero de ID
    const userId = 1;
    //Agregamos producto al carrito del usuario
    const productToAdd = { productId: 1, quantity: 2 };
    const response = await requester.post(`/carts/${userId}/add`).send(productToAdd);//Sumamos producto
    expect(response.status).to.equal(200);
    //tiene que estar incluido el producto
    expect(response.body).to.include(productToAdd);
  });


// 03. Test para eliminar producto del carrito
  it('Eliminacion de un producto al carrito segun ID del usuario', async () => {
    const userId = 1;
    const productToRemove = { productId: 1 };
    const response = await requester.delete(`/carts/${userId}/remove`).send(productToRemove);//eliminacion
    expect(response.status).to.equal(200);
    //NO tiene que estar incluido el producto eliminado
    expect(response.body).to.not.include(productToRemove);
  });

  // 04.  Test para crear un producto
  it("Creacion del un carrito", async () => {
    const { statusCode, ok, _body } = await requester.post("/carts").send()
    //idCart = _body.result._id
    expect(statusCode).to.equal(200)
    expect(ok).to.be.true
    expect(_body.result.products).to.be.an("array")
})
});

