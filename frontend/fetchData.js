const showLoggedUsername = () =>{
    const userNameElement = document.getElementById("logged-username");

    ///finding the username element
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }
    //show username in the webpage

    userNameElement.innerText = user.userName;
    
};

const checkLoggedInUser = () =>{
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }
    else{
        window.location.href = "/frontend/index.html";
    }
};

const logOut= () =>{
    //clear local storage
    localStorage.clear();
    checkLoggedInUser();
};

const fetchAllPosts = async() =>{
    let data = [];
    try{
        const res = await fetch("http://localhost:1500/getAllPosts");
        data = await res.json();
        console.log(data);
        showAllPosts(data);
    }
    catch(err){
        console.log("error fetching data from server");
    
    }
};

const showAllPosts = (allPosts) =>{
    // console.log(allPosts);
    const postContainer = document.getElementById('post-container');
    //inner html empty
    postContainer.innerHTML = "";

    allPosts.forEach(async(post) => {
        const postDiv = document.createElement("div");
        postDiv.classList.add("post");
        

        ///inner hmtl when writng fuction then come error
        // my code ...   
        // <span>${timeDifference(`${post.postedTime}`)}</span>

        //previous
        //<span>${post.postedTime}<span>
        postDiv.innerHTML = `
                   <div class="post-header">
                <div class="post-user-image">
                    <img 
                        src=${post.postedUserImage}
                    />
                </div>

                <div class="post-username-time">
                    <p class="post-username">${post.postedUserName}</p>
                    <div class="posted-time">
                          <span>${post.postedTime}<span>
                        <span>ago</span>
                    </div>
                </div>
            </div>

            <div class="post-text">
                <p class="post-text-content">
                    ${post.postText}
                </p>
                
            </div>

            <div class="post-image">
                <img 
                   src=${post.postImageUrl}
                />
            </div>
        `;

        postContainer.appendChild(postDiv);

        //console.log(post.postId);
        ///comments under posts that
        let postComments =  await fetchAllCommentsOfAPost(post.postId);
        //using await then data are not come with promise
        // console.log("postcomments : ",postComments);
        postComments.forEach((comment) =>{
            const commentsHolderDiv = document.createElement("div");
            commentsHolderDiv.classList.add("comments-holder");
            commentsHolderDiv.innerHTML = `
                    <div class="comment">
                        <div class="comment-user-image">
                            <img 
                                src=${comment.commentedUserImage}
                            />
                        </div>
    
                        <div class="comment-text-container">
                            <h4>
                                ${comment.commentedUserName}
                            </h4>
                            <p class="comment-text">
                                ${comment.commentText}
                            </p>
                        </div>
                    </div>  
            `;



          postDiv.appendChild(commentsHolderDiv);  
        });

        ///adding new comment to the post 

        const addNewCommentDiv = document.createElement("div");
        addNewCommentDiv.classList.add("postComment-holder") ;
        // consol.log(post.postId);
        addNewCommentDiv.innerHTML = `
            <div class="post-comment-input-field-holder">
                <input type="text" placeholder="post your comment" class="postComment-input-field"id ="postComment-input-for-postId-${post.postId}"/>
            </div>
    
            <div class="comment-btn-holder">
                    <button onClick = handlePostComment(${post.postId}) id="comment-btn" class="postComment-btn">Comment</button>
            </div> 




                <div class="edit-btn">
                    <button onclick = "edit(${post.postId})" class="addPost-btn">edit</button>
                </div>
                        
                <div class="delete-btn">
                    <button onclick = "dlt(${post.postId})" class="addPost-btn">delete</button>
                </div>
        `;

        postDiv.appendChild(addNewCommentDiv);
    });
   // consol.log(post.postID);
}; ///post loop end 

const handlePostComment = async (postId) =>{
    //console.log("adding comment to the post");
    //console.log("adding comment to post no : ",postId);

    // collecting login user id from local storage
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }
    //console.log("user : ",user);
    const commentedUserId = user.userId;



    ///geting comment from input field

    const commentTextElement = document.getElementById(
        `postComment-input-for-postId-${postId}`
    );

    const commentText = commentTextElement.value;
    //console.log("adding comment for post no ",postId , "and the comment text : ",commentText);
     
    //current time of the content 
    let now = new Date();
    //let timeOfComment = now.toISOString();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let timeOfComment = now.toISOString();
    // console.log(timeOfComment);
    // console.log("time of the comments is ",now);
    //console.log("time of the comments is ",timeOfComment);

    const commentObject ={
        commentOfPostId : postId,
        commentedUserId : commentedUserId,
        commentText : commentText,
        commentTime : timeOfComment,
    };

    ///post req 
    try{
        const res = await fetch("http://localhost:1500/postComment",{
            method : "POST",
            headers : {
                "content-type": "application/json",
            },
            body : JSON.stringify(commentObject),
        });
        const data = await res.json();

    }
    catch(err){
        console.log("error while sending data to the server ",err);
    }
    finally{
        location.reload();
    }
};

const fetchAllCommentsOfAPost = async(postId) =>{
    let commentsOfPost = [];
    // console.log( postId );
    try{
        //all comments find
        const res = await fetch(`http://localhost:1500/getAllComments/${postId}`);
        commentsOfPost = await res.json();
    }
    catch(err){
        console.log("error featching commests from the server : ",err);
    }
    finally{
        return commentsOfPost;
    }

};


//adding new post function
const handleAddNewPost = async() =>{
    // console.log("adding new post");

    //geting user id from local storage
    let user = localStorage.getItem("loggedInUser");
    if(user){
        user = JSON.parse(user);
    }
    const postedUserId = user.userId;

    //time of the post 
    let now = new Date();
    
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    let timeOfPost = now.toISOString();

    // post text
    const postTextElement = document.getElementById("newPost-text");
    const postText = postTextElement.value;

    //post image
    const postImageElement = document.getElementById("newPost-image");
    const postImageUrl = postImageElement.value;

    // creating psot object

    const postObject = {
        postedUserId : postedUserId,
        postedTime : timeOfPost,
        postText:postText,
        postImageUrl:postImageUrl,
    };
    console.log("sending data server ",postObject);

    try{
        const res = await fetch("http://localhost:1500/addNewPost",{
            method : "POST",
            headers : {
                "content-type": "application/json",
            },
            body : JSON.stringify(postObject),
        });
        const data = await res.json();

    }
    catch(err){
        console.log("error while sending data to the server ",err);
    }
    finally{
        location.reload();
    }
};


async function dlt(postId){
    try {
        const res = await fetch(`http://localhost:1500/postDelete/${postId}`,{
            method : "DELETE",
            headers : {
                "content-type": "application/json",
            },
            
        });
        const data = await res.json();
        fetchAllPosts();
        
    } catch (error) {
        console.log("internal server error",error);
    }

};








///called auto 
fetchAllPosts();
//showLoggedUsername();

//auto 
checkLoggedInUser();
showLoggedUsername();