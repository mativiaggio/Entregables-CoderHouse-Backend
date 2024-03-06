const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const http = require("http");
const productsRouter = require("./routes/products.router.js");
const cartRouter = require("./routes/cart.router.js");
const viewsRouter = require("./routes/views.router");

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
// io.on("connection", (socket) => {
//   console.log("Nuevo cliente conectado");

//   io.on("newProduct", (productData) => {
//     newProduct.push(productData);
//     io.emit("updateProducts", { productData });
//   });

// });

// io.on("disconnect", () => {
//   console.log("Cliente desconectado");
// });

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
  (req, res, next) => {
    const products = require("../products.json");
    res.locals.products = products;
    next();
  },
  viewsRouter
);

server.listen(PORT, () => console.log(`Server running, PORT: ${PORT}`));
