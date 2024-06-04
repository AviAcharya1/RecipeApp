const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const connectDB = require("./db/config");

dotenv.config();
const router = express.Router();

const app = express();
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ["POST", "GET"],
  credentials: true
}));

connectDB();

const Home = require("./controllers/controllers");
const LoginRoute = require("./routes/LoginRoute");
const RegisterRoute = require("./routes/RegisterRoute");
const verifyToken = require("./Middleware/middleware");
const RecipeRoute = require("./routes/RecipeRoute");
const ForgotPassword = require("./routes/forgotPassword");


app.use("/auth", RegisterRoute);
app.use("/auth", LoginRoute);
app.use("/auth", RecipeRoute);
app.use("/auth", router);
app.use("/auth", ForgotPassword);

router.get("/", verifyToken, Home.Home);

module.exports = router;

app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});


