import { Router } from "express";
import usersModel from "../dao/managers/dbManagers/models/users.model.js";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, age, password } = req.body;
    if (!first_name || !last_name || !email || !age || !password) {
      return res
        .status(422)
        .send({ status: "error", message: "Incomplete values" });
    }

    const exists = await usersModel.findOne({ email });

    if (exists) {
      return res
        .status(400)
        .send({ status: "error", message: "User already exists" });
    }

    await usersModel.create({
      first_name,
      last_name,
      email,
      age,
      password,
    });

    res
      .status(201)
      .send({ status: "success", message: "User created successfully" });
  } catch (error) {
    res.status(500).send({ status: "error", message: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
      req.session.user = {
        name: "Coder admin",
        email,
        role: "admin",
      };

      return res.send({ status: "success", message: "Login successful" });
    }

    const user = await usersModel.findOne({ email, password });

    if (!user) {
      return res
        .status(400)
        .send({ status: "error", message: "Incorrect credentials" });
    }

    req.session.user = {
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      age: user.age,
      role: "user",
    };

    res.send({ status: "success", message: "Login successful" });
  } catch (error) {
    return res.status(500).send({ status: "error", message: error.message });
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      res.status(500).send({ status: "error", message: error.message });

    res.redirect("/login");
  });
});

export default router;
