const handleLogin = async () =>{
    //console.log("button clicked");
    const userIdInput = document.getElementById("user-id");
    const passwordInput = document.getElementById("password");

    const userId = userIdInput.value;
    const password = passwordInput.value;

    const user = {
        userId:userId,
        password:password,
    };
    const userInfo = await fetchUserInfo(user);
    //console.log(userInfo);
    const errorElement = document.getElementById("user-login-error");
    if(userInfo.length === 0) {
        //console.log("data did not found");
        errorElement.classList.remove("hidden");
    }
    else{
        errorElement.classList.add("hidden");
        localStorage.setItem("loggedInUser", JSON.stringify(userInfo[0]));
        window.location.href = "/frontend/post.html";

    }

};

const fetchUserInfo = async(user) =>{
    let data;
   try{
    const res = await fetch("http://localhost:1500/getUserInfo",{
        method:"POST",
        headers:{
            "content-type":"application/json",
        },
        body:JSON.stringify(user),
    });
    
    data = await res.json();
   }
   catch(err){
    console.log("error connection to the server :",err);
   }
   finally{
    //console.log("user info from server : ",data);
    return data;

   }
};