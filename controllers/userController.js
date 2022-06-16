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
  let password = req.body.password;
  var hashedPassword = bcrypt.hashSync(password, salt);

  // SQL Query:
  let SQL = `INSERT INTO users (fname, lname, email, password) VALUES ('${req.body.fname}','${req.body.lname}','${req.body.email}','${hashedPassword}')`;
  const [result] = await connection.query(SQL);

  if (result.affectedRows == 1) {
    return res.send({ status: "1" });
  }
  res.send({ status: "0" });
};
