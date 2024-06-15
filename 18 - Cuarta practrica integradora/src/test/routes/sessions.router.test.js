const chai = require("chai");
const supertest = require("supertest");
const expect = chai.expect;
const request = supertest("http://localhost:8080");

function generateRandomEmail() {
  const randomString = Math.random().toString(36).substring(7);
  return `${randomString}@coderhouse.com`;
}

describe("Tests para el enrutador de sesiones", () => {
  it("Debería registrar un nuevo usuario", async () => {
    const newUser = {
      first_name: "John",
      last_name: "Doe",
      age: 25,
      email: generateRandomEmail(),
      password: "contraseña123",
    };
    const response = await request.post("/api/sessions/register").send(newUser);
    expect(response.status).to.equal(302);
  });

  it("Debería iniciar sesión correctamente", async () => {
    const credentials = {
      username: "nuevo@usuario.com",
      password: "contraseña123",
    };
    const response = await request
      .post("/api/sessions/login")
      .send(credentials);
    expect(response.status).to.equal(302);
  });

  it("Debería redirigir a la autenticación de GitHub", async () => {
    const response = await request.get("/api/sessions/github");
    expect(response.status).to.equal(302);
  });
});
