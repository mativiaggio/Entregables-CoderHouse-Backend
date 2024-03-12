const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const http = require("http");
const productsRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router");

// Monoose
const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://matiasviaggio-admin:hDyTCsrU5IQo4vkR@coderhousebackend.vocmiqt.mongodb.net/backend"
  )
  .then(() => {
    console.log("Mongoose conectado");
  });
const ProductModel = require("./models/products");

const PORT = 8080;
const app = express();
const server = http.createServer(app);
// const io = new Server(server); Tuve problemas con los websockets y buscando en internet decia que habia que pasarlo asi:
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Socket.io
let newProduct = [];

io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("newProduct", (productData) => {
    newProduct.push(productData);
    socket.emit("updateProducts", { productData });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);

app.use(
  "/",
  async (req, res, next) => {
    try {
      const products = await ProductModel.find({}).lean();
      res.locals.products = products;
      next();
    } catch (err) {
      console.error("Error al obtener productos:", err);
      next(err);
    }
  },
  viewsRouter
);

// cookies
app.get("/setCookie", (req, res) => {
  res.cookie("codercookie", "Useful cookie", { maxAge: 120 * 1000 });
  res.send("Cookie has been set");
});

app.get("/getCookie", (req, res) => {
  const cookies = req.cookies;
  res.send(`Cookies: ${cookies}`);
});

app.get("/deleteCookie", (req, res) => {
  res.clearCookie("codercookie");
  res.send("Cookie was removed");
});

app.get("/*", (req, res) => {
  res.send("404 Not Found");
});

server.listen(PORT, () => console.log(`Server running, PORT: ${PORT}`));
