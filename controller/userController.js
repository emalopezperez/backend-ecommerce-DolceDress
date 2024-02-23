const User = require("../models/userModel");
const { generateToken } = require("../config/jwtToken");

const createUser = async (req, res) => {
  try {
    const email = req.body.email;
    const findUser = await User.findOne({ email: email });
    if (!findUser) {
      const newUser = await User.create(req.body);
      res.status(201).json(newUser);
    } else {
      res.status(400).json({
        message: "Usuario ya esta registrado",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({
      message: "Ocurrió un error al crear el usuario",
      success: false,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor, proporcione su correo electrónico y contraseña",
        success: false,
      });
    }

    const findUser = await User.findOne({ email });

    if (findUser && (await findUser.isPasswordMatched(password))) {
      return res.json({
        _id: findUser._id,
        firstname: findUser.firstname,
        lastname: findUser.lastname,
        email: findUser.email,
        mobile: findUser.mobile,
        token: generateToken(findUser._id),
      });
    } else {
      return res.status(400).json({
        message: "Correo electrónico o contraseña incorrectos",
        success: false,
      });
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);

    return res.status(500).json({
      message: "Ocurrió un error al iniciar sesión",
      success: false,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
};
