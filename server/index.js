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
    const sqlForAllPosts = `SELECT users.userName as postedUserName , users.userImage as postedUserImage , posts_org.postedTime ,posts_org.postId ,posts_org.postText ,posts_org.postImageUrl from posts_org inner join users on posts_org.postedUserId=users.userId order by posts_org.postedTime desc`;

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

   
///getting commenst of a single post from

app.get('/getAllComments/:postId',(req,res)=>{
    let id = req.params.postId;

    let sqlForAllComments = `select users.userName as commentedUserName , users.userImage as commentedUserImage, comments.commentId ,comments.commentsOfPostId,comments.commentText,comments.commentTime from comments inner join users on comments.commentedUserId = users.userId where comments.commentsOfPostId = ${id}`;
//    find problem 

 let query = db.query(sqlForAllComments,(err,result) => {
    if(err){
        console.log("error fetching comments from the database : ",err);
        throw err;
        //when throw err active then nodemon crush
    }
    else{
        res.send(result);
    }
});

});

//adding new comment for a  post 
app.post("/postComment" , ( req,res) =>{
    const {commentOfPostId , commentedUserId , commentText , commentTime} = req.body;

    //const dataFromFrontEnd = req.body;
   // console.log(dataFromFrontEnd);  ///object 
   let sqlForAddingNewComments = `INSERT INTO comments (commentId, commentsOfPostId, commentedUserId, commentText, commentTime) VALUES (NULL, ? , ? , ? , ?);`;
   let query = db.query(sqlForAddingNewComments,[commentOfPostId,commentedUserId,commentText,commentTime],(err,result) => {
      if(err){
        console.log("error adding comments to the database ",err);
      }
      else{
        res.send(result);
      }
   });
});

app.post("/addNewPost" , (req,res) =>{
    //destructure object 

    const {postedUserId, postedTime,postText,postImageUrl} = req.body;

    //sql query for adding new post

    let sqlForAddingNewPost = `INSERT INTO posts_org (postId, postedUserId, postedTime, postText, postImageUrl) VALUES (NULL, ? , ?, ?, ?)`;

    let query = db.query(sqlForAddingNewPost , [postedUserId,postedTime,postText,postImageUrl] , (err,result) =>{
        if(err){
            console.log("error while adding new in database post ",err);
            throw err;
        }
        else{
            res.send(result);
        }
    }
  );
});

app.delete("/postDelete/:postId",(req,res) => {
    console.log(req.params.postId);
   const id = req.params.postId;
   let sql = `DELETE FROM posts_org WHERE postId = ${id};`;

   let query = db.query(sql, id,(err,result) =>{
    if(err){
        console.log("error while adding new in database post ",err);
        throw err;
    }
    else{
        res.send(result);
    }
})
});

///update post

// app.put("/updatePost/:postId", (req, res) => {
//     // Extract postId from request parameters and the rest from the request body
//     const postId = req.params.postId;
//     const { postedUserId, postedTime, postText, postImageUrl } = req.body;

//     // SQL query for updating the post
//     let sqlForUpdatingPost = `
//         UPDATE posts_org 
//         SET postedUserId = ?, 
//             postedTime = ?, 
//             postText = ?, 
//             postImageUrl = ? 
//         WHERE postId = ?
//     `;

//     // Execute the query
//     let query = db.query(sqlForUpdatingPost, [postedUserId, postedTime, postText, postImageUrl, postId], (err, result) => {
//         if (err) {
//             console.log("Error while updating the post in database", err);
//             res.status(500).send("Error updating post");
//         } else if (result.affectedRows === 0) {
//             // No rows affected, meaning the postId might not exist
//             res.status(404).send("Post not found");
//         } else {
//             res.send("Post updated successfully");
//         }
//     });
// });


app.listen(port, () => {
    console.log(`server is a running on port ${port}`);

    
});