const express = require('express');
const app = express();
const dotenv = require('dotenv');
var bodyParser = require("body-parser");
dotenv.config();

const con = require('./data/db');
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.redirect("/index.html");
})

app.get("/delete-data", (req, res) => {
    const deleteQuery="delete from `appointment data` where id=?";
    con.query(deleteQuery,[req.query.id],(err,rows)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/data")
        }
    })
});

app.get("/data", (req, res) => {
    con.query("select * from `appointment data`", (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            res.render("read.ejs",{rows});
        }
    })
})
app.post("/create", (req, res) => {

    const name = req.body.name;
    const email = req.body.email;
    const number = req.body.number;
    try {

        con.query("INSERT INTO `appointment data` (name,email,number)  VALUES(?,?,?)", [name, email,number], (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                res.redirect("/data")
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});


app.listen(process.env.PORT || 5000, (error) => {
    if (error) throw error;
    console.log(`server running on ${process.env.PORT}`);
});