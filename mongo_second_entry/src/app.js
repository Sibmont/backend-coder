import express from "express";
import handlebars from "express-handlebars";
import mongoose from "mongoose";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Server } from "socket.io";
import cartsRouter from "../src/routes/carts.router.js";
import productsRouter from "../src/routes/products.router.js";
import viewsRouter from "../src/routes/views.router.js";

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

// Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

try {
  await mongoose.connect(
    "mongodb+srv://Sibmont:xaJD8Fn4jflgi1Z1@cluster55575sb.uumokbv.mongodb.net/ecommerce?retryWrites=true&w=majority"
  );
  console.log("DB connected");
} catch (error) {
  console.log(error.message);
}

const server = app.listen(8080, () =>
  console.log("Server running on port 8080")
);

const socketServer = new Server(server);

socketServer.on("connection", (socket) => {
  console.log("New client connected");
});

app.set("socketio", socketServer);
