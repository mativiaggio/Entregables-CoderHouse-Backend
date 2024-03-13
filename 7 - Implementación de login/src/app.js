const express = require("express");
const { Server } = require("socket.io");
const handlebars = require("express-handlebars");
const http = require("http");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");

// Mongoose
const mongoose = require("mongoose");

const PORT = 8080;
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// Session
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");

mongoose
  .connect(
    "mongodb+srv://matiasviaggio-admin:hDyTCsrU5IQo4vkR@coderhousebackend.vocmiqt.mongodb.net/backend"
  )
  .then(() => {
    console.log("Mongoose conectado");
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

// Session
app.use(cookieParser());
app.use(
  session({
    secret: "ourSecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl:
        "mongodb+srv://matiasviaggio-admin:hDyTCsrU5IQo4vkR@coderhousebackend.vocmiqt.mongodb.net/",
    }),
  })
);

// Routes
app.use("/api/sessions", sessionRouter);
app.use("/", viewsRouter);

server.listen(PORT, () => console.log(`Server running, PORT: ${PORT}`));
