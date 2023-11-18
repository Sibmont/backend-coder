import bcrypt from "bcrypt";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Hash password
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));
//   1234 -> s23k8dgh23

// Validate password
const isValidPassword = (plainPassword, hashedPassword) =>
  bcrypt.compareSync(plainPassword, hashedPassword);

// Authentication first done by passport -> that returns user to req.user
const authorization = (role) => {
  return async (req, res, next) => {
    if (req.user.role !== role)
      return res
        .status(403)
        .send({ status: "error", message: "No permissions" });
    next();
  };
};

export { __dirname, authorization, createHash, isValidPassword };
