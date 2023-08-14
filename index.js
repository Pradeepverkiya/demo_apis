const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const port = process.env.PORT || 4000;

dotenv.config();

//Connect to database
mongoose.connect(
  process.env.DB_CONNECT,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => console.log("Connected to database")
);

//Imports routes
const userRoutes = require("./routes/users");

// Middlewares
app.use(express.json());
app.use(cors());

// Route middlewares
app.use("/api/", userRoutes);

// Route handler for the root URL
app.get("/", (req, res) => {
  res.send("Welcome to the server!");
});

app.listen(port, () => {
  console.log("Server up and running on port " + port);
});
