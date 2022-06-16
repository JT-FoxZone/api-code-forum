import connection from "../connect.js";
import bcrypt from "bcryptjs";
const salt = bcrypt.genSaltSync(10);

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

export const Register = async (req, res) => {
  // Hash a password:
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, salt);

  // Request variable
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
      return res.send({ status: "1" });
    }
    res.send({ status: "0" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};
