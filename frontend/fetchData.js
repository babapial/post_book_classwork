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
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');
        
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
                        <span>${post.postedTime}</span>
                        <span>hours ago</span>
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
        console.log("postcomments : ",postComments);
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
    });
};

const fetchAllCommentsOfAPost = async(postId) =>{
    let commentsOfPost = [];
    console.log( postId );
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




fetchAllPosts();