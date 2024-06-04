const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Login = require("../controllers/LoginController");

router.post("/login", Login);
function verifyToken(req, res, next) {
  const token = req.header("Authorization");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    req.token = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token." });
  }
}

module.exports = router;
