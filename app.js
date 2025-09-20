const express = require("express");
require("dotenv").config();
const app = express();

const userRouter = require("./routes/user.routes");
const indexRouter = require("./routes/index.routes");
const connectDB = require("./config/db");
connectDB();

const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);
app.use("/", indexRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
