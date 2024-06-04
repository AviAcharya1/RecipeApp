const User = require("../Schema/UserSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Login = async (req, res) => {
  try {
    console.log("Login request received"); 
    const { email, password } = req.body;
    console.log("Request body:", req.body);

    const user = await User.findOne({ email: { $regex: new RegExp(email, "i") } });
    console.log("User found:", user); 

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log("Password match result:", passwordMatch);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const token = jwt.sign(
      { email: user.email, _id: user._id },
      process.env.SECRET, {
        expiresIn: "5h",
      }
    );
    console.log("Generated JWT token:", token);

    res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (e) {
    console.error(e.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = Login;
