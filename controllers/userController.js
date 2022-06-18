import connection from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import moment from "moment";

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
    //If duplicate emails 😂:
    if (result.length != 0) {
      return res.json({
        status: "duplicate",
        message: "duplicate emails, please try another email.",
      });
    }
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }

  //not duplicate emails ✔️ --> Insert User:
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

/**Post Question ❓*/
export const postQuestion = async (req, res) => {
  //Time now
  const now = moment().format();
  //Data
  const Question = {
    title: req.body.title,
    content: req.body.content,
    datetime_post: now,
    category_id: req.body.category_id,
    user_id: req.body.user_id,
  };

  const SQL = "INSERT INTO `post` SET ?";

  try {
    const [result] = await connection.query(SQL, Question);
    if (result.affectedRows == 1) {
      return res.status(200).send({ status: "ok", message: "post success" });
    }
    res.send({ status: "0", message: "post failure" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Get Post ❔*/
export const getPost = async (req, res) => {
  const post_id = req.params.post_id;
  const SQL = `
  SELECT category.category_name, post.title, post.content, users.fname, users.lname, post.datetime_post
  FROM post 
  INNER JOIN users ON (post.user_id=users.user_id) 
  INNER JOIN category ON (post.category_id=category.category_id) 
  WHERE post.post_id = ?;`;

  try {
    const [result] = await connection.query(SQL, [post_id]);

    if (result.length != 0) {
      return res.status(200).send({ status: "ok", result });
    }
    res.send({ status: "0", message: "not found" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Post List 🗒️*/
export const ListPost = async (req, res) => {
  const category_id = req.params.category_id;
  const SQL = `
  SELECT post.post_id, post.title, users.fname, users.lname, post.datetime_post
  FROM post 
  INNER JOIN users ON post.user_id=users.user_id 
  WHERE post.category_id = ?`;

  try {
    const [result] = await connection.query(SQL, [category_id]);

    if (result.length != 0) {
      return res.status(200).send({ status: "ok", result });
    }
    res.send({ status: "0", message: "not found" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Comment ✒️*/
export const Comment = async (req, res) => {
  //Time now
  const now = moment().format();
  //Data
  const comment = {
    comment: req.body.comment,
    post_id: req.body.post_id,
    datetime_comment: now,
    user_id: req.body.user_id,
  };

  const SQL = `INSERT INTO comment SET ?`;
  try {
    const [result] = await connection.query(SQL, comment);
    if (result.length != 0) {
      return res.status(200).send({ status: "ok" });
    }
    res.send({ status: "0" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
};

/**Comment List 📖*/
export const CommentList = async (req, res) => {
  const post_id = req.params.post_id;
  const SQL = `SELECT comment.comment_id, comment.comment, comment.datetime_comment, users.fname 
  FROM comment 
  INNER JOIN users ON comment.user_id=users.user_id 
  WHERE comment.post_id = ?;`

  try {
    const [result] = await connection.query(SQL, [post_id]);

    if (result.length != 0) {
      return res.status(200).send({ status: "ok", result });
    }
    res.send({ status: "0", message: "not found" });
  } catch (error) {
    res.status(500).send({ status: "E", error });
  }
}