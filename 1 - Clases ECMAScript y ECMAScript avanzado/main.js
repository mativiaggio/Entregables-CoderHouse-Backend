class ProductManager {
  constructor() {
    this.products = [];
    this.productIdCounter = 1;
  }

  // Agregar producto pasando todos los parametros
  addProduct(index, title, description, price, thumbnail, code, stock) {
    let missingParams = [];

    // Con el siguiente switch se realiza una validacion para llenar un array con todos los datos faltantes
    // si es que hay alguno.
    switch (true) {
      case !index:
        missingParams.push("index");
      case !title:
        missingParams.push("title");
      case !description:
        missingParams.push("description");
      case !price:
        missingParams.push("price");
      case !thumbnail:
        missingParams.push("thumbnail");
      case !code:
        missingParams.push("code");
      case !stock:
        missingParams.push("stock");
    }

    if (missingParams.length > 0) {
      console.error(
        `Faltan los siguientes campos obligatorios: ${missingParams.join(", ")}`
      );
      return;
    }

    // Utilizo un .find para devolver un booleano true o false segun exista un item con el mismo code,
    // al tener una funcion que genera el code de manera aleatoria no deberia pasar, pero se agrega igual la validacion.
    const existingProduct = this.products.find(
      (product) => product.code === code
    );

    // Si llega a estar repetido devuelvo el error.
    if (existingProduct) {
      console.error("Ya existe un producto con el mismo código.");
      return;
    }

    // Llegado a esta instancia todo es correcto para agregar el item.
    const newProduct = {
      index,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };

    this.products.push(newProduct);
    console.log("Producto agregado correctamente:", newProduct);
  }

  // Obtengo todos los productos de la lista
  getProducts() {
    return this.products;
  }

  // Obtengo el producto que quiero por ID (code)
  getProductByCode(code) {
    const foundProduct = this.products.find((product) => product.code === code);
    if (foundProduct) {
      return foundProduct;
    } else {
      console.error("Producto no encontrado. Code:", code);
    }
  }
}

const productManager = new ProductManager();

// Producto 1 hardcodeado
let code1 = generateRandomId();
productManager.addProduct(
  get_index(),
  "Producto 1",
  "Descripción 1",
  19.99,
  "/img1.jpg",
  code1,
  50
);

// Producto 2 hardcodeado
let code2 = generateRandomId();
productManager.addProduct(
  get_index(),
  "Producto 2",
  "Descripción 2",
  29.99,
  "/img2.jpg",
  code2,
  30
);

// Hardcodeo un producto existente para testear el error
productManager.addProduct(
  get_index(),
  "Producto 3",
  "Descripción 3",
  59.99,
  "/img3.jpg",
  code2,
  30
);

// Hardcodeo un producto sin parametros para testear el error
productManager.addProduct();

// Obtener todos los productos registrados
const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

// Obtengo un producto por code, en este caso el primer producto hardcodeado anteriormente.
const productByCode = productManager.getProductByCode(code1);
console.log("Producto por code:", productByCode);

// Hago un query con un id que no esta registrado en el sistema (tiene un caracter extra para
// asegurarme de que no existe).
const prodcutoInexistente = productManager.getProductByCode(123456789);

// FUNCIONES INICIALES:

// get_index devuelve la cantidad de items + 1, o sea el indice que debe ser utilizado cuando
// se carga un nuevo producto
function get_index() {
  return productManager.products.length + 1;
}

// generateRandomId genera un codigo unico de 8 caracteres, no era requerido por la consigna,
// pero me parecio copado agregarlo.
function generateRandomId(length = 8) {
  const characters = "0123456789";
  let randomId = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomId += characters.charAt(randomIndex);
  }

  return randomId;
}
