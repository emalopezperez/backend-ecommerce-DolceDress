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

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.json(users);
  } catch (error) {
    throw new Error(error);
  }
};

const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        success: false,
      });
    }

    res.json(user);
  } catch (error) {
    console.error("Error al buscar usuario:", error);
    res.status(500).json({
      message: "Ocurrió un error al buscar el usuario",
      success: false,
    });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", success: false });
    }

    const deletedUser = await User.findByIdAndDelete(id);

    res.json({
      deletedUser,
      message: "Usuario eliminado exitosamente",
      success: true,
    });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({
      message: "Ocurrió un error al eliminar el usuario",
      success: false,
      error: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstname: req?.body?.firstname,
        lastname: req?.body?.lastname,
        email: req?.body?.email,
        mobile: req?.body?.mobile,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado", success: false });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      message: "Ocurrió un error al actualizar el usuario",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
};
