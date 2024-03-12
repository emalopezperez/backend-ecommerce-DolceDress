const User = require("../models/userModel");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const sendEmail = require("../controller/emailController");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Por favor, proporcione su correo electrónico y contraseña",
        success: false,
      });
    }

    const findAdmin = await User.findOne({ email });

    if (findAdmin.role !== "admin") throw new Error("Not Authorised");
    if (findAdmin && (await findAdmin.isPasswordMatched(password))) {
      const refreshToken = await generateRefreshToken(findAdmin?._id);

      const updateuser = await User.findByIdAndUpdate(
        findAdmin.id,
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
        _id: findAdmin._id,
        firstname: findAdmin.firstname,
        lastname: findAdmin.lastname,
        email: findAdmin.email,
        mobile: findAdmin.mobile,
        token: generateToken(findAdmin._id),
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

const resetPassword = async (req, res) => {
  const { password } = req.body;
  const { token } = req.params;

  try {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) throw new Error(" Token Expired, Please try again later");
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    res.json(user);
  } catch (error) {
    console.error("Error al querer reset password", error);
    res.status(500).json({
      message: "Ocurrió un error al querer reset password",
      success: false,
      error: error.message,
    });
  }
};

const getWishlist = async (req, res) => {
  const { _id } = req.user;

  try {
    const findUser = await User.findById(_id).populate("wishlist");

    res.status(201).json({
      success: true,
      message: "Successfully",
      findUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ocurrió un error",
      success: false,
      error: error.message,
    });
  }
};

const saveAddress = async (req, res) => {
  const { _id } = req.user;

  try {
    const addresUser = await User.findByIdAndUpdate(
      _id,
      {
        address: req?.body?.address,
      },
      {
        new: true,
      }
    );

    res.status(201).json({
      success: true,
      message: "Save address successfully",
      addresUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Ocurrió un error",
      success: false,
      error: error.message,
    });
  }
};

const userCart = async (req, res) => {
  const { cart } = req.body;
  const { _id } = req.user;

  try {
    let products = [];
    const user = await User.findById(_id);

    const alreadyExistCart = await Cart.findOne({ orderby: user._id });

    if (alreadyExistCart) {
      await alreadyExistCart.deleteOne();
    }

    await Promise.all(
      cart.map(async (cartItem) => {
        const object = {
          product: cartItem._id,
          count: cartItem.count,
          color: cartItem.color,
        };

        const getPrice = await Product.findById(cartItem._id)
          .select("price")
          .exec();
        object.price = getPrice.price;

        products.push(object);
      })
    );

    let cartTotal = products.reduce(
      (total, product) => total + product.price * product.count,
      0
    );

    const newCart = await new Cart({
      products,
      cartTotal,
      orderby: user?._id,
    }).save();

    res.json(newCart);
  } catch (error) {
    res.status(500).json({
      message: "Ocurrió un error",
      success: false,
      error: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  const { _id } = req.user;

  try {
    const cart = await Cart.findOne({ orderby: _id }).populate(
      "products.product"
    );

    res.json({
      message: "User's cart retrieved successfully",
      success: true,
      cart,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error retrieving user's cart",
      success: false,
      error: error.message,
    });
  }
};

const emptyCart = async (req, res) => {
  const { _id } = req.user;
  try {
    const user = await User.findOne({ _id });
    const cart = await Cart.findOneAndDelete({ orderby: user._id });
    res.json(cart);
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = {
  createUser,
  loginUser,
  loginAdmin,
  logout,
  getAllUsers,
  getUser,
  deleteUser,
  updateUser,
  handleRefreshToken,
  updatePassword,
  forgotPassword,
  resetPassword,
  getWishlist,
  saveAddress,
  userCart,
  getUserCart,
  emptyCart,
};
