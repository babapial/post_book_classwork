const fetchAllPosts = async() =>{
    let data = [];
    try{
        const res = await fetch("http://localhost:1500/getAllPosts");
        data = await res.json();
        console.log(data);
    }
    catch(err){
        console.log("error fetching data from server");

    }
};

fetchAllPosts();