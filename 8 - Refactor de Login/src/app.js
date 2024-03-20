const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const http = require("http");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");
const passport = require("passport");
const initializePassport = require("./config/passport.config");
require("dotenv").config();

// Mongoose
const mongoose = require("mongoose");

// Middlewares
const selectLayout = require("./middlewares/selectLayout");

// Configuración básica
const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// Conexión a la base de datos MongoDB
mongoose
  .connect(
    `mongodb+srv://matiasviaggio-admin:${process.env.MONGO_PASSWORD}@coderhousebackend.vocmiqt.mongodb.net/backend`
  )
  .then(() => {
    console.log("Mongoose conectado");
  });

// Configuración de Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Middlewares de Express
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

// Middleware de selección de diseño
app.use(selectLayout);

// Middleware de sesiones
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
app.use(cookieParser());
app.use(
  session({
    secret: "ourSecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://matiasviaggio-admin:${process.env.MONGO_PASSWORD}@coderhousebackend.vocmiqt.mongodb.net/`,
    }),
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

// Iniciar el servidor
server.listen(PORT, () =>
  console.log(`Servidor en ejecución en el puerto ${PORT}`)
);
