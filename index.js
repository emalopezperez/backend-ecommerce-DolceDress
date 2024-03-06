const express = require("express");
const dontenv = require("dotenv").config();
const { connection } = require("./dbConect");

const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRuote");
const blogRouter = require("./routes/blogRoute");
const categoryProductRouter = require("./routes/categoryProduct");
const categorBlogRouter = require("./routes/categoryBlog");
const brandRouter = require("./routes/brandRoute");

const PORT = process.env.PORT;

connection();
const app = express();

app.use(cookieParser());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/category-product", categoryProductRouter);
app.use("/api/category-blog", categorBlogRouter);
app.use("/api/brand", brandRouter);
app.use("/api/blog", blogRouter);

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
