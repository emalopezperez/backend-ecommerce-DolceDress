const User = require("../models/userModel");
const sendEmail = require("../controller/emailController");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

const jwt = require("jsonwebtoken");

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
      const refreshToken = await generateRefreshToken(findUser?._id);

      const updateuser = await User.findByIdAndUpdate(
        findUser.id,
        {
          refreshToken: refreshToken,
        },
        { new: true }
      );
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 72 * 60 * 60 * 1000,
      });

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

const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      throw new Error("No Refresh Token in Cookies");
    }

    const user = await User.findOne({ refreshToken });
    if (!user) {
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
      });
      return res.sendStatus(204);
    }

    await User.findOneAndUpdate(
      { refreshToken: refreshToken },
      { refreshToken: "" }
    );

    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
    });

    res.sendStatus(204);
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({
      message: "Ocurrió un error al cerrar sesión",
      success: false,
    });
  }
};

const handleRefreshToken = async (req, res) => {
  try {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies");
    const refreshToken = cookie.refreshToken;
    const user = await User.findOne({ refreshToken });
    if (!user)
      throw new Error(" No Refresh token present in db or not matched");
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err || user.id !== decoded.id) {
        throw new Error("There is something wrong with refresh token");
      }
      const accessToken = generateToken(user?._id);
      res.json({ accessToken });
    });
  } catch (error) {
    console.log(error);
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

const updatePassword = async (req, res) => {
  try {
    const { _id } = req.user;
    const { password } = req.body;

    const user = await User.findById(_id);
    if (password) {
      user.password = password;
      const updatedPassword = await user.save();
      res.json(updatedPassword);
    } else {
      res.json(user);
    }
  } catch (error) {
    console.error("Error al actualizar password", error);
    res.status(500).json({
      message: "Ocurrió un error al actualizar el password",
      success: false,
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "No se encontró usuario",
      success: false,
    });
  }

  try {
    const token = await user.createPasswordResetToken();
    await user.save();

    const resetURL = `Hi, Please follow this link to reset Your Password. This link is valid till 10 minutes from now. <a href='http://localhost:3000/api/user/forgot-password/${token}'>Click Here</a>`;

    const data = {
      to: email,
      text: "Hey User",
      subject: "Forgot Password Link",
      html: resetURL,
    };

    await sendEmail(data);

    res.json(token);
  } catch (error) {
    console.error("Error al querer forgot password", error);
    res.status(500).json({
      message: "Ocurrió un error al querer forgot password",
      success: false,
      error: error.message,
    });
  }
};

module.exports = {
  createUser,
  loginUser,
  logout,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  updatePassword,
  forgotPassword,
};
