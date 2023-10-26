
const mongodb = require('mongodb');
const path = require('path');
const express = require('express');
const cookie = require('cookie-parser');
const mongoose = require('mongoose');
const { ejs } = require('ejs');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
const DB='mongodb://academy-23907:9GOE03uO4fzR4Z39p1iMnAj5YKLjlp@db-academy-23907.nodechef.com:5360/academy'
    mongoose.connect(DB)
    .then(() => console.log("database connected"))
    .catch(() => console.log("error"));
   
app.use(express.static(path.join(path.resolve(), "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.set("view engine", "ejs");


const user = [];
// schemaa
const sc = new mongoose.Schema({
    Firstname: String,
    lastname:String,
    
    email: String,

    phone: String,
    gender: String,
    School: String,
    SchoolBoard: String,

    position: String,
    address:String,
    pincode:String,
    state:String,
    city:String,
   
})
const adminsc=mongoose.Schema({
    username:String,
    password:String
})
const st = new mongoose.Schema({
    fullname:String,
    dob:String,
    email:String,   
    phone:String,
    classes:String,
    subjects:[String],
    gender:String

})


// Models
const adminschema = mongoose.model("SchoolRegisterID",adminsc);
const student=mongoose.model("student details",st)
const cont= mongoose.model("schooldetails", sc);

// api get
app.get("/admin", (req, res) => {
     return res.redirect("index.html");
})
app.get("/employee",(req,res)=>{
    return res.redirect("employee-login.html")
})

app.get('/studentPortal', async (req, res) => {
    const{School,city} = req.query;
    const storedData = {
        School,city
    }
    // const a = req.originalUrl;
    res.render('student', { storedData});
});



// api post
app.post("/student", async (req, res) => {
    const {fullname,dob,email,phone,classes,subjects,gender} = req.body;
    const regstudent= await student.create({fullname,dob,email,phone,classes,subjects,gender})
    return res.redirect("thanks.html");
})
app.post("/registration", async (req, res) => {
    const {Firstname, Lastname,email,phone,gender,School,SchoolBoard,position,address,pincode,state,city,pin} = req.body;
    const reguser = await cont.create({Firstname, Lastname,email,phone,gender,School,SchoolBoard,position,address,pincode,state,city,pin  });

    const redirectToUrl = `/studentPortal?School=${School}&city=${city}`;
    res.redirect(redirectToUrl);
})


app.post("/School_Registration",async(req,res)=>{
    const{username,password}=req.body;

   
    let us=await adminschema.findOne({username})    
    if(!us){
        return res.redirect("login.html")
     }
     
    const ismatch=await adminschema.findOne({password})
    
    if(!ismatch)return res.redirect("login.html");
    
    const token=jwt.sign({_id:user._id},"asdfghdyyttjytjuriuru7jiry");
    const decode=jwt.verify(token,"asdfghdyyttjytjuriuru7jiry");
    res.cookie(username,token,{httpOnly:true,expires:new Date(Date.now()+60*1000) });
   
    res.render("school");
    
});



app.listen(process.env.PORT || 3000, () => {
    console.log("listening")
  })
  