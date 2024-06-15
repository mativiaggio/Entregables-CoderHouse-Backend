const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;
const request = supertest("http://localhost:8080");

describe("Tests para el enrutador de carritos", () => {
  it("Debería obtener un carrito por su ID", async () => {
    const cartId = "662ee17cbfd38e12c43c9b4e";
    const response = await request.get(`/cart/${cartId}`);
    expect(response.status).to.equal(302);
    expect(response.body).to.be.an("object");
  });
});
