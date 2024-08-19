const express = require("express");
const mysql = require("mysql");
const cors = require("cors");

const port = 1500;

const app = express();

//middleware

app.use(cors());
app.use(express.json());

//making connection with mysql

// app.get(("/example"),(req,res) =>{
//    res.send("hellooo");
// });


var db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'postbook2'
  });


db.connect((err) =>{
    if(err){
        console.log("somethings went wrong connecting database : ",err);
        throw err;
    }
    else {
        console.log("mysql server connectec");
    }
    
});

app.post("/getUserInfo",(req,res)=>{
    
    const {userId,password} = req.body;

    const getUserInfosql = `SELECT userId,userName,userImage FROM users WHERE users.userId =? AND userPassword = ?`;

    let query = db.query(getUserInfosql,[userId,password],(err,result)=>{
        if(err){
            console.log("something went wrong",err);
            throw err;
        }
        else{
            res.send(result);
        }
    } );
})

app.get('/getAllPosts',(req,res)=>{
    const sqlForAllPosts = `SELECT users.userName as postedUserName , users.userImage as postedUserImage , posts_org.postedTime ,posts_org.postedTime ,posts_org.postText ,posts_org.postImageUrl from posts_org inner join users on posts_org.postedUserId=users.userId order by posts_org.postedTime desc`;

    let query = db.query(sqlForAllPosts,(err,results) =>{
        if(err){
            console.log("error loding all posts from database : ",err);
            throw err;
        }
        else{
            console.log(results);
            res.send(results);
        }
    })
});

   
 

app.listen(port, () => {
    console.log(`server isa running on port ${port}`);
});