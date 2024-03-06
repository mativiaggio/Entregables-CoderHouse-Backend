/*
Los errores los pase por console.error y por alert, los alerts estan comentados para que no molesten,
pero se pueden probar si se quiere descomentandolos.

Decidi hacer el tp de las dos formas, como lo pedia el enunciado y con una interfaz html para que se pruebe en el navegador.
Me tome la libertad de usar jquery.

Las consignas estan aplicadas tanto hardcodeadas, como interactivamente. Los casos que deben devolver error asi como el traer todos
los registros estan hardcodeados.
*/

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
      // alert(`Faltan los siguientes campos obligatorios: ${missingParams.join(", ")}`);
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
      // alert("Ya existe un producto con el mismo código.");
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

    // Hago append a la tabla del item que se acaba de generar, vacio los inputs enterables y genero nuevos ids e indice.
    $("#table-body").append(create_tr(newProduct));

    $("#ID").val(generateRandomId());
    $("#index").val(get_index());

    $("#Title").val("");
    $("#Description").val("");
    $("#Price").val("");
    $("#Thumbnail").val("");
    $("#Stock").val("");
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
      // alert(`Producto no encontrado. Code: ${code}`);
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

// Obtener todos los productos registrados
const allProducts = productManager.getProducts();
console.log("Todos los productos:", allProducts);

// Obtengo un producto por code, en este caso el primer producto hardcodeado anteriormente.
const productByCode = productManager.getProductByCode(code1);
console.log("Producto por code:", productByCode);
// alert(`Producto por code: ${JSON.stringify(productByCode)}`);

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

// create_tr crea una table row a partir del array que se le proporciona.
function create_tr(array) {
  let html = "";
  html = `
        <tr>
          <td>${array.index}</td>
          <td>${array.code}</td>
          <td>${array.title}</td>
          <td>${array.description}</td>
          <td>${array.price}</td>
          <td>${array.thumbnail}</td>
          <td>${array.stock}</td>
        </tr>
  `;

  return html;
}

// Siempre seteo los inputs no enterables.
$("#Code").val(generateRandomId());
$("#index").val(get_index());

// Esta funcion genera un nuevo id cuando el usuario clickea el boton
$("#generate-id").click(function () {
  $("#Code").val(generateRandomId());
});

// Al tocar el boton agregar producto hago un preventDefault para que la page no se recargue
// y ejecuto el metodo que agrega el producto a la lista.
$("#main-form").on("submit", function (e) {
  e.preventDefault();

  let index = $("#index").val();
  let title = $("#Title").val();
  let description = $("#Description").val();
  let price = parseFloat($("#Price").val());
  let thumbnail = $("#Thumbnail").val();
  let code = $("#Code").val();
  let stock = parseInt($("#Stock").val(), 10);

  const productManager = new ProductManager();
  productManager.addProduct(
    index,
    title,
    description,
    price,
    thumbnail,
    code,
    stock
  );
});
