import connection from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const secret = "Code-Forum-T.Jirayus";

const salt = bcrypt.genSaltSync(10);


/**Get all Users 👤*/
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
        function (err, isLogin) { //If the plain text password correct ✅
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
    }
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};
