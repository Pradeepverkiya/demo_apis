const Users = require("../model/Users");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const validateEmail = (email) => {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  return emailPattern.test(email);
};

//Create new user
const register = async (req, res) => {
  if (req.body.firstName === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter first name.",
    });
    return;
  }

  if (req.body.lastName === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter last name.",
    });
    return;
  }

  if (req.body.email === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter email address.",
    });
    return;
  }

  if (!validateEmail(req.body.email)) {
    res.status(200).send({
      status: false,
      message: "Please enter a valid email address.",
    });
    return;
  }

  if (req.body.password === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter password.",
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(200).send({
      status: false,
      message: "Password length should be equal to or greater than six.",
    });
    return;
  }

  try {
    const userAlreadyExist = await Users.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });

    if (userAlreadyExist != null) {
      res.status(200).send({
        status: false,
        message:
          "The email address is already registered with our database. Please enter a different email address.",
      });
    } else {
      const plainPassword = req.body.password;

      // Hash the password asynchronously
      const hashPassword = await bcrypt.hash(plainPassword, saltRounds);

      const user = new Users({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
      });
      try {
        const saveUser = await user.save();
        res.status(200).send({
          status: true,
          message:
            "Your account has been created successfully. You can now log in.",
          data: saveUser,
        });
      } catch (error) {
        res.status(400).send(error);
      }
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

//Login user
const login = async (req, res) => {
  if (req.body.email === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter email address.",
    });
    return;
  }

  if (!validateEmail(req.body.email)) {
    res.status(200).send({
      status: false,
      message: "Please enter a valid email address.",
    });
    return;
  }

  if (req.body.password === undefined) {
    res.status(200).send({
      status: false,
      message: "Please enter password.",
    });
    return;
  }

  if (req.body.password.length < 6) {
    res.status(200).send({
      status: false,
      message: "Password length should be equal to or greater than six.",
    });
    return;
  }

  try {
    const user = await Users.findOne({
      email: { $regex: new RegExp(req.body.email, "i") },
    });
    if (user) {
      const plainPassword = req.body.password;

      const isPasswordMatched = await bcrypt.compare(
        plainPassword,
        user.password
      );

      if (isPasswordMatched) {
        var token = jwt.sign({ ususerIde: user._id }, "private_key");
        console.log(token);
        res.status(200).send({
          status: true,
          message: "You have successfully logged in to your account.",
          data: user,
          token: token,
        });
      } else {
        res.status(200).send({
          status: false,
          message:
            "Invalid email address or password. Please verify and try again.",
        });
      }
    } else {
      res.status(200).send({
        status: false,
        message: "No account was found with the provided email address.",
      });
    }
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = {
  register,
  login,
};
