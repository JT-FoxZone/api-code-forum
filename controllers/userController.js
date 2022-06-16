import connection from "../connect.js";

export const getAllUser = async (req, res) => {
  let sql = `SELECT * FROM users`;
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
