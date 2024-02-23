const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  try {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];

      if (token) {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded?.id);

        if (!user) {
          throw new Error("Usuario no encontrado");
        }

        req.user = user;
        next();
      } else {
        throw new Error("Token inválido");
      }
    } else {
      throw new Error("No hay token");
    }
  } catch (error) {
    next(error);
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const { email } = req.user;
    const adminUser = await User.findOne({ email });

    if (!adminUser) {
      throw new Error("Usuario no encontrado");
    }

    if (adminUser.role !== "admin") {
      throw new Error("No es administrador");
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { authMiddleware, isAdmin };
