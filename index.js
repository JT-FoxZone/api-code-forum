import express from "express";
import userRouter from "./routes/user.js";

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter);

app.get("/", (req, res) => {
  res.send(`Run On ${port}`);
});

app.listen(port, () => console.log(`Server Run on ${port}`));
