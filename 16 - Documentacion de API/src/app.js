const express = require("express");
const http = require("http");
const mongoose = require("mongoose");
const handlebars = require("express-handlebars");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
const { Server } = require("socket.io");
const dotenv = require("dotenv");
const addLogger = require("./middlewares/addLogger.middleware");
const { loggerTestsRouter } = require("./routes/loggerTest.router");
const { logger } = require("./utils/logger");

// Import routes
const cartsRouter = require("./routes/carts.router");
const productsRouter = require("./routes/products.router");
const viewsRouter = require("./routes/views.router");
const sessionRouter = require("./routes/sessions.router");
const emailRouter = require("./routes/emails.router");
const mocksRouter = require("./routes/mocks.router");
const recoverPasswordRouter = require("./routes/recoverPassword.router");
const resetPasswordRouter = require("./routes/resetPassword.router");
const newResetRequestRouter = require("./routes/newResetRequest.router");
const userRouter = require("./routes/users.router");
const compression = require("express-compression");
const swaggerUiExpress = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

// Import configurations
const initializePassport = require("./config/passport.config");
const envConfig = require("./config/config");

// Import middlewares
const selectLayout = require("./middlewares/selectLayout");

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 8080;

// Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:8080",
    methods: ["GET", "POST"],
  },
});

// MongoDB connection
mongoose
  .connect(
    `mongodb+srv://matiasviaggio-admin:${envConfig.mongoPassword}@coderhousebackend.vocmiqt.mongodb.net/backend`
  )
  .then(() => {
    logger.info("Mongoose conectado");
  })
  .catch((err) => {
    logger.error(`Mongoose connection error: ${err.message}`);
  });

//swagger-documentation
const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "documetación de API de CoderHouse",
      description: "API del proyecto final de CoderHouse",
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Handlebars configuration
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

// Express middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));

// Socket.io
let newProduct = [];
io.on("connection", (socket) => {
  logger.info("New client connected");
  socket.on("newProduct", (productData) => {
    newProduct.push(productData);
    socket.emit("updateProducts", { productData });
  });
  socket.on("disconnect", () => {
    logger.info("Client disconnected");
  });
});

// Session middleware
app.use(cookieParser());
app.use(
  session({
    secret: "ourSecret",
    resave: true,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: `mongodb+srv://matiasviaggio-admin:${envConfig.mongoPassword}@coderhousebackend.vocmiqt.mongodb.net/`,
    }),
  })
);

// Passport initialization
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Express compression
app.use(
  compression({
    brotli: { enabled: true, zlib: {} },
  })
);

app.use(addLogger);

// Routes
app.use("/api/logger", loggerTestsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/mail", emailRouter);
app.use("/api/users", userRouter);
app.use("/mocks", mocksRouter);

app.use("/account", recoverPasswordRouter);
app.use("/account", resetPasswordRouter);
app.use("/account", newResetRequestRouter);

app.use("/", viewsRouter);

// Starting the server
server.listen(PORT, () => logger.info(`Server running on port ${PORT}`));
