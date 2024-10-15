const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const db = mysql.createPool({
  connectionLimit: 10,
  host: "172.17.3.211", //127.0.0.1
  user: "root",
  password: "mypass",
  database: "mydatabase",
});

const app = express();

app.use(cors());
app.get("/home", (req, res) => {
  // req.
  res.send("rrr");

  db.query(
    "INSERT INTO rooms (type, position) VALUES ('test', 'test')",
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        console.log(result);
      }
    }
  );
});
app.listen(8082, () => {
  console.log("Server listining on port:8082");
});
