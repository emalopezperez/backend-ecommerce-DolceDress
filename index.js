const express = require("express");
const dontenv = require("dotenv").config()
const {connection} = require("./dbConect")

const cors = require("cors");
const bodyParser = require("body-parser");

const authRouter = require("./routes/authRoute")
const PORT = process.env.PORT

connection();
const app = express();

app.use(cors());
app.use(bodyParser.json());


app.use("/api/user", authRouter);


app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});