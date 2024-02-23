const mongoose = require('mongoose');

const connection = async () => {
  const DB_URL = process.env.DB_URL;
  try {
    await mongoose.connect(DB_URL);

    console.log("Conexión a la base de datos exitosa");
  } catch (error) {
    console.error(error);
    throw new Error("No se ha podido conectar a la base de datos");
  }
};

module.exports = {
  connection
};
