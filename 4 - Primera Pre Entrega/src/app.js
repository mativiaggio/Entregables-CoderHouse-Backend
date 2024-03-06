const express = require("express");

const productsRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");

const PORT = 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.listen(PORT, () => console.log(`Server running, PORT: ${PORT}`));
