import MongoStore from "connect-mongo";
import express from "express";
import handlebars from "express-handlebars";
import session from "express-session";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import cartsRouter from "./routes/carts.router.js";
import productsRouter from "./routes/products.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import viewsRouter from "./routes/views.router.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const productsFilePath = path.join(__dirname, "../files/products.json");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

// Handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

try {
  await mongoose.connect(
    "mongodb+srv://Sibmont:xaJD8Fn4jflgi1Z1@cluster55575sb.uumokbv.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

app.use(
  session({
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
      ttl: 3600,
    }),
    secret: "Coder55575Secret",
    resave: true, // allows us to be able to refresh the session, for example, after an inactivity period
    saveUninitialized: true, // helps us to deactivate the session's storage if the user is not authenticated yet, or they have not initialized their session
    // cookie: { maxAge: 30000 }
  })
);

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);

const server = app.listen(8080, () =>
  console.log("Server running on port 8080")
);

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  console.log("New client connected");
});

app.set("socketio", socketServer);
