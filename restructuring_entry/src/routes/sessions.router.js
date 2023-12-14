import { Router } from "express";
import passport from "passport";
import usersModel from "../dao/managers/dbManagers/models/users.model.js";

const router = Router();

router.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "fail-register" }),
  async (req, res) => {
    // try {
    //   const { first_name, last_name, email, age, password } = req.body;
    //   if (!first_name || !last_name || !email || !age || !password) {
    //     return res
    //       .status(422)
    //       .send({ status: "error", message: "Incomplete values" });
    //   }
    //   const exists = await usersModel.findOne({ email });
    //   if (exists) {
    //     return res
    //       .status(400)
    //       .send({ status: "error", message: "User already exists" });
    //   }
    //   await usersModel.create({
    //     first_name,
    //     last_name,
    //     email,
    //     age,
    //     password,
    //   });
    //   res
    //     .status(201)
    //     .send({ status: "success", message: "User created successfully" });
    // } catch (error) {
    //   res.status(500).send({ status: "error", message: error.message });
    // }
    res
      .status(201)
      .send({ status: "success", message: "User registered successfully" });
  }
);

router.get("/fail-register", async (req, res) => {
  res.status(500).send({ status: "error", message: "Register failure" });
});

router.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "fail-login" }),
  async (req, res) => {
    // try {
    //   const { email, password } = req.body;

    //   if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    //     req.session.user = {
    //       name: "Coder admin",
    //       email,
    //       role: "admin",
    //     };

    //     return res.send({ status: "success", message: "Login successful" });
    //   }

    //   const user = await usersModel.findOne({ email, password });

    //   if (!user) {
    //     return res
    //       .status(400)
    //       .send({ status: "error", message: "Incorrect credentials" });
    //   }

    //   req.session.user = {
    //     name: `${user.first_name} ${user.last_name}`,
    //     email: user.email,
    //     age: user.age,
    //     role: "user",
    //   };

    //   res.send({ status: "success", message: "Login successful" });
    // } catch (error) {
    //   return res.status(500).send({ status: "error", message: error.message });
    // }

    if (!req.user) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid credentials" });
    }

    req.session.user = {
      name: `${req.user.first_name} ${req.user.last_name}`,
      email: req.user.email,
      age: req.user.age,
      role: "user",
    };

    res.send({ status: "success", message: "Login successful" });
  }
);

router.get("fail-login", async (req, res) => {
  res.status(500).send({ status: "error", message: "Login failure" });
});

// Github registration endpoint
router.get(
  "/github",
  passport.authenticate(
    "github",
    { scope: ["user:email"] },
    async (req, res) => {
      res.send({ status: "success", message: "User registered" });
    }
  )
);

// Github login endpoint
router.get(
  "/github-callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    req.session.user = req.user;
    req.session.user.role = "user";
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error)
      res.status(500).send({ status: "error", message: error.message });

    res.redirect("/login");
  });
});

export default router;
