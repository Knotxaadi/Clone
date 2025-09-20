const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.get("/register", (req, res) => {
  res.render("register");
});
router.post(
  "/register",
  body("email").trim().isEmail().isLength({ min: 12 }),
  body("password").trim().isLength({ min: 6 }),
  body("name").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array(), message: "Invalid Data" });
    }
    const { email, password, name } = req.body;

    const hashPass = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      email,
      name,
      password: hashPass,
    });
    res.redirect("/user/login");
  }
);

router.get("/login", (req, res) => {
  res.render("login");
});
router.post(
  "/login",
  body("password").trim().isLength({ min: 5 }),
  body("name").trim().isLength({ min: 3 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array(),
        message: "Invalid Data",
      });
    }

    const { name, password } = req.body;
    const user = await userModel.findOne({
      name: name,
    });
    if (!user) {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        message: "Username or password is incorrect",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        username: user.name,
      },
      process.env.JWT_SECRET
    );

    res.cookie("token", token);
    // res.send("logged In");
    res.redirect("/home");
  }
);

module.exports = router;
