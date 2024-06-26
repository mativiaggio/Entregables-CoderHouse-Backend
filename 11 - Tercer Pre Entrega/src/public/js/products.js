function addToCart(productId) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ productId: productId }),
  };

  fetch(`/products/${productId}/add-to-cart`, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al agregar producto al carrito");
      }
      console.log("Producto agregado al carrito");
      swal.fire("Success", "Producto agregado con exito", "success");
    })
    .catch((error) => {
      console.error("Error al agregar producto al carrito:", error);
    });
}
