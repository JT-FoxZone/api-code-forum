import connection from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secret = "Code-Forum-T.Jirayus";

const salt = bcrypt.genSaltSync(10);

/**Get all Users 👥*/
export const getAllUser = async (req, res) => {
  const sql = `SELECT * FROM users`;
  try {
    const [result] = await connection.query(sql);
    if (result.length != 0) {
      return res.status(200).send({ status: "ok", result });
    }
    res.status(200).send({ status: "0", result: [] });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Get User by ID 👤*/
export const getUser = async (req, res) => {
  const id = req.body.user_id;
  const SQL =
    "SELECT `fname`, `lname`, `email` FROM `users` WHERE `user_id` = ?";

  try {
    const [result] = await connection.query(SQL, [id]);

    if (result.length != 0) {
      return res.json(result);
    } else {
      res.json({ status: "Not found", message: "Not found this ID" });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

/**Regiter 📑*/
export const Register = async (req, res) => {
  // Hash a password:
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Request variable:
  let NEW_USER = {
    fname: req.body.fname,
    lname: req.body.lname,
    email: req.body.email,
    password: hashedPassword,
  };

  // SQL Query:
  let SQL = `INSERT INTO users SET ?`;

  // Check for duplicate emails:
  let Check = `SELECT user_id FROM users WHERE email LIKE  '${req.body.email}'`;

  try {
    const [result] = await connection.query(Check);
    if (result.length != 0) {
      return res.json({
        status: "error",
        message: "duplicate emails, please try another email.",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }

  // Insert User:
  try {
    const [result] = await connection.query(SQL, NEW_USER);
    if (result.affectedRows == 1) {
      return res.status(200).send({ status: "1" });
    }
    res.send({ status: "0" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Login 🍀*/
export const Login = async (req, res) => {
  // SQL Query:
  const SQL = `SELECT * FROM users WHERE email='${req.body.email}'`;

  try {
    const [result] = await connection.query(SQL);
    if (result.length != 0) {
      bcrypt.compare(
        req.body.password,
        result[0].password,
        function (err, isLogin) {
          //If the plain text password correct ✅
          if (isLogin) {
            var token = jwt.sign(
              {
                id: result[0].user_id,
              },
              secret,
              {
                expiresIn: "1h",
              }
            );
            return res.json({ status: "ok", message: "login success", token });
          } else {
            return res.json({ status: "error", message: "login failed" });
          }
        }
      );
    } else {
      res.json({ status: "Not found", message: "Not found this email" });
    }
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Authentication 🧩*/
export const Authen = async (req, res) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, secret);
    res.json({ status: "ok", decoded });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

/**Get All Category 📒*/
export const getAllCategory = async (req, res) => {
  // SQL Query:
  const SQL = "SELECT * FROM `category`";
  try {
    const [result] = await connection.query(SQL);
    res.json(result);
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};

/**Get Category by ID 🔑*/
export const getCategory = async (req, res) => {
  const id = req.params.category_id;
  const SQL = "SELECT * FROM `category` WHERE `category_id` = ?";

  try {
    const [result] = await connection.query(SQL, [id]);

    if (result.length != 0) {
      return res.json(result);
    } else {
      res.json({ status: "Not found", message: "Not found this Category" });
    }
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
};
