const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Tests para el enrutador de productos", () => {
  it("Debería obtener todos los productos", async () => {
    const response = await request.get("/products");
    expect(response.status).to.equal(302);
    expect(response.body).to.be.an("object");
  });

  it("Debería obtener un producto por su ID", async () => {
    const productId = "123";
    const response = await request.get(`/products/${productId}`);
    expect(response.status).to.equal(302);
    expect(response.body).to.be.an("object");
  });

  it("Debería agregar un nuevo producto", async () => {
    const newProduct = { name: "Nuevo Producto", price: 10.99 };
    const response = await request.post("/products").send(newProduct);
    expect(response.status).to.equal(302);
    expect(response.body).to.be.an("object");
  });
});
