const express = require("express");
const app = express();
const port = 4000;
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);
const multer = require("multer");
const secret = "hello";
const jwt = require("jsonwebtoken");
// const { pipeline } = require("stream");

const upload = multer();

const saltRounds = 10;

app.use(express.static(__dirname + "/public"));

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userid",
    secret: "compe273_lab1_splitwise",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 24 * 1000,
    },
  })
);

// const con = mysql.createConnection({
//   host: "splitwise-instance.cxfc1pmp6ndg.us-east-2.rds.amazonaws.com",
//   user: "admin",
//   password: "chakri96",
//   ssl: true,
//   database: "splitwise",
// });

const con = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "",
  database: "mahasiswa",
});

// con.connect((err) => {
//   if (err) {
//     console.log(err);
//   }
//   console.log("Connected!");
//   //con.end();
// });

//Allow Access Control

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/login", (req, res) => {
  if (req.session.user) {
    res.send({ loggedIn: true, user: req.session.user });
  } else {
    res.send({ loggedIn: false });
  }
});

app.post("/login", function (req, res) {
  
  //console.log(req.body);
  const email = req.body.email;
  const password = req.body.password;
  // console.l(email);
  // console.l(password);
  const selectLoginQuery =
    "Select user_id,fullname,password,email,currency from user where email=?";

  // console.l(selectLoginQuery);
  con.query(selectLoginQuery, [email], (err, result) => {
    // generate token
    const token = jwt.sign({result}, secret, {
      expiresIn: 1000000,
    });
    
    if (err) {
      throw err;
    } else {
      if (result.length > 0) {
        bcrypt
          .compare(password, result[0].password)
          .then(function (response) {
            // console.l(password);
            if (response) {
              res.cookie("cookie", "admin", {
                maxAge: 9000000,
                httpOnly: false,
                path: "/",
              });
              req.session.user = result;
              
              // console.l(req.session.user);
              res.status(200).json({
                user_id: result[0].user_id,
                fullname: result[0].fullname,
                email: result[0].email,
                currency: result[0].currency,
                token: token
              });

              res.end("Successful Login");
            } else {
              res.status(404).json({ message: "Invalid credentials!" });
            }
          })
          .catch((response) => {
            res.status(404).json({ message: "Invalid credentials!" });
          });
      } else {
        res.status(404).json({ message: "Invalid credentials!" });
      }
    }
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////MAHASISWA FUNCTIONS//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.get("/mahasiswa/get", function (req, res) {
  const array = [];
  console.log('asd');
  // console.l(req.params.email);
  con.query(
    "SELECT * FROM data_mahasiswa",
    (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        array.push(result[i]);
      }
      console.log(array);
      res.status(200);
      res.send(array);
    }
  );
});

app.get("/mahasiswa/get/:id", function (req, res) {
  const id = req.params.id;
  const recentActivityQuery =
    "SELECT * FROM data_mahasiswa WHERE id = ?"
  con.query(recentActivityQuery, [id], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.send(result[0]);
  });
});

app.post("/mahasiswa/add", function (req, res) {
  const nim = req.body.nim;
  const nama = req.body.nama;
  const fakultas = req.body.fakultas;
  const insertMahasiswa =
    'INSERT INTO data_mahasiswa(nim, nama, fakultas) VALUES(?, ?, ?)';
  // console.l(insertMahasiswa);
  con.query(
    insertMahasiswa,
    [nim, nama, fakultas],
    (err, result) => {
      if (err) throw err;
      // console.l(result);
    }
  );
  res.status(200).json({ message: "Successful" });
});

app.post("/mahasiswa/edit", function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const nim = req.body.nim;
  const nama = req.body.nama;
  const fakultas = req.body.fakultas;
  const leaveGroupQuery =
    "UPDATE data_mahasiswa SET nim = ?, nama = ?, fakultas = ? where id = ?";
  con.query(leaveGroupQuery, [nim, nama, fakultas, id], (err, result) => {
    if (err) throw err;
    // console.l(result);
    res.status(200).json({ message: "Left group" });
  });
});

app.post("/mahasiswa/delete/:id", function (req, res) {
  const id = req.params.id;
  console.log(req);
  const recentActivityQuery =
    "DELETE FROM data_mahasiswa WHERE id = ?"
  con.query(recentActivityQuery, [id], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.send(result[0]);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////BUKU FUNCTIONS//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////


app.get("/buku/get", function (req, res) {
  const array = [];
  console.log('asd');
  // console.l(req.params.email);
  con.query(
    "SELECT * FROM data_buku",
    (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        array.push(result[i]);
      }
      console.log(array);
      res.status(200);
      res.send(array);
    }
  );
});

app.get("/buku/get/:id", function (req, res) {
  const id = req.params.id;
  const recentActivityQuery =
    "SELECT * FROM data_buku WHERE id = ?"
  con.query(recentActivityQuery, [id], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.send(result[0]);
  });
});

app.post("/buku/add", function (req, res) {
  const judul = req.body.judul;
  const pengarang = req.body.pengarang;
  const insertBuku =
    'INSERT INTO data_buku(judul, pengarang) VALUES(?, ?)';
  // console.l(insertBuku);
  con.query(
    insertBuku,
    [judul, pengarang],
    (err, result) => {
      if (err) throw err;
      // console.l(result);
    }
  );
  res.status(200).json({ message: "Successful" });
});

app.post("/buku/edit", function (req, res) {
  console.log(req.body);
  const id = req.body.id;
  const judul = req.body.judul;
  const pengarang = req.body.pengarang;
  const fakultas = req.body.fakultas;
  const leaveGroupQuery =
    "UPDATE data_buku SET judul = ?, pengarang = ? where id = ?";
  con.query(leaveGroupQuery, [judul, pengarang, id], (err, result) => {
    if (err) throw err;
    // console.l(result);
    res.status(200).json({ message: "Left group" });
  });
});

app.post("/buku/delete/:id", function (req, res) {
  const id = req.params.id;
  console.log(req);
  const recentActivityQuery =
    "DELETE FROM data_buku WHERE id = ?"
  con.query(recentActivityQuery, [id], (err, result) => {
    if (err) throw err;
    res.status(200);
    res.send(result[0]);
  });
});

////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////PINJAM FUNCTIONS//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////

app.post("/pinjam/add", function (req, res) {
  const mahasiswa_id = req.body.nim.value;
  const form = req.body.value;
  // console.log(req.body);
  let executeValue = true;
  const insertGroup =
    "insert into pinjam_header(mahasiswa_id) values(?)";
  con.query(insertGroup, [mahasiswa_id], (err, result) => {
    const insertId = result.insertId;
      form.forEach((ele) => {
        const emailOfUser = ele.value;
        console.log(ele.value);
        const usergroupQuery =
          "insert into pinjam_detail(pinjam_id, buku_id,mahasiswa_id) values(?,?,?)";
        con.query(
          usergroupQuery,
          [insertId, emailOfUser, mahasiswa_id],
          (err, result) => {
            if (err) throw err;
            // console.l(result);
          }
        );
      });
      res.status(200);
      res.send(result);
  });
});

app.get("/pinjam/get", function (req, res) {
  const array = [];
  // console.l(req.params.email);
  con.query(
    "SELECT a.id, b.nama FROM pinjam_header a left join data_mahasiswa b on a.mahasiswa_id = b.id",
    (err, result) => {
      if (err) throw err;
      for (let i = 0; i < result.length; i++) {
        array.push(result[i]);
      }
      console.log(array);
      res.status(200);
      res.send(array);
    }
  );
});

app.get("/pinjam/get/:id", function (req, res) {
  console.log(req.body);
  const user = '';
  const id = req.params.id;
  const form = req.body.value;
  console.log(req.body);
  let executeValue = true;
  const array = [];
  const array_detail = [];
  const insertGroup =
    "SELECT * FROM pinjam_header a left join data_mahasiswa b on a.mahasiswa_id = b.id WHERE a.id = ?";
  con.query(insertGroup, [id], (err, result) => {
    const row = result;
        const usergroupQuery =
          "SELECT judul FROM pinjam_detail a left join data_buku b on a.buku_id = b.id WHERE pinjam_id = ?";
        con.query(usergroupQuery, [id], (err, result_detail) => {
            const rowD = result_detail;
            if (err) throw err;
            array_detail.push(rowD);
            array.push(row);
            console.log(array);
            // res.send(array);
            res.json({ users: array, detail: array_detail });
          });
        res.status(200);
  });
});

app.listen(port, () => {
  console.log("Server connected to port 4000");
});

module.exports = app;
