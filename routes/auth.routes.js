const { Router } = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const shortid = require("shortid");
const router = Router();

router.post(
  "/register",
  [
    check("email", "Invalid email address").isEmail(),
    check(
      "password",
      "Incorrect password. Minimal length is 8 alphanumeric characters."
    )
      .isAlphanumeric()
      .isLength({
        min: 6,
      }),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Bad registration data",
        });
      }

      const { email, password } = req.body;

      const candidate = await User.findOne({
        email,
      });

      if (candidate) {
        res.status(400).json({
          message: "User with provided email has already been registered",
        });
      }

      const code = shortid.generate();
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        password: hashedPassword,
        code,
      });

      await user.save();

      res.status(201).json({
        message: "User has been successfully created!",
      });
    } catch (e) {
      res.status(500).json({
        message: "Something went wrong. Try again please.",
      });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please enter a valid email").normalizeEmail().isEmail(),
    check("password", "Enter your password").exists(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(400).json({
          errors: errors.array(),
          message: "Error during login",
        });
      }

      const { email, password } = req.body;

      const user = await User.findOne({
        email,
      });

      if (!user) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(400).json({
          message: "Wrong password",
        });
      }

      const token = jwt.sign(
        {
          code: user.code,
        },
        config.get("jwtSecret"),
        {
          expiresIn: "1h",
        }
      );

      res.json({
        token,
        code: user.code,
      });
    } catch (e) {
      res.status(500).json({
        message: "Something went wrong. Try again please.",
      });
      console.log(e);
    }
  }
);

module.exports = router;
