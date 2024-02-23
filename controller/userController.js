const User = require("../models/userModel");

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
                success: false
            });
        }
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ 
            message: "Ocurrió un error al crear el usuario",
            success: false
        });
    }
}

module.exports = {
    createUser
};
