let postContainer = document.getElementById("posts")
function getAlert(message) {
    const alert = `<div class="alert alert-h alert-danger alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`
        let alertDiv = document.createElement("div")
        alertDiv.classList.add("alert")
        alertDiv.innerHTML = alert
        postContainer.append(alertDiv)
}
function modalHide(modal) {
    const modalIntance = bootstrap.Modal.getInstance(modal)
    modalIntance.hide()
}
function getPosts( reload = true, pageNum = 1){
    axios.get(`https://tarmeezacademy.com/api/v1/posts?limit=5&page=${pageNum}`)
    .then((res)=>{ 
        let posts = res.data.data
        if (reload) {
            postContainer.innerHTML = ""
        }
        finalPage = res.data.meta.last_page
        for (let i = 0; i < posts.length; i++) {
            let content = posts[i];
            let post = `<div class="card my-4 shadow">
            <h5 class="card-header d-flex align-items-center gap-3 position-relative">
                <a href="profile.html" class="p-pic rounded-circle">
                    <img class="img-fluid h-100 w-100" src="${(content.author.profile_image).length?content.author.profile_image:"../images/defult.png"}" alt="">
                </a>
                <div>@${content.author.name}</div>
                <p class="text-black-50 fw-semibold flex-grow-1 text-end fs-14">${content.created_at}</p>
                <div class="action-btn action" onclick="showTheList(${content.id})">
                    <i class="fa-solid fa-ellipsis-vertical fs-14 p-2 action"></i>
                </div>
                <div class="position-absolute rounded action action-list action-list${content.id} p-1 d-none">
                    <button type="button" class="btn btn-primary my-1 d-block w-100" onclick="editPost('${encodeURIComponent(JSON.stringify(content))}')" data-bs-toggle="modal" data-bs-target="#edit-modal">
                        edit
                    </button>
                    <button type="button" onclick="deletePost(${content.id})" class="btn btn-danger my-1 d-block w-100" data-bs-toggle="modal" data-bs-target="#delete-modal">
                        delete
                    </button>
                </div>
            </h5>
            <!-- start card body  -->
            <div class="card-body">
                <div class="post-img mb-3">
                    <img class="img-fluid rounded-4" src="${content.image}" alt="">
                </div>
                <div class="fw-semibold">${content.body}</div>
                <div class="comment${content.id} border-top mt-3 pt-2 d-flex flex-column gap-1 justify-content-center">
                    <!-- Button trigger modal -->
                    <div onclick="showComments(${content.id})" class="comment-btn${content.id} comment-btn border-top mt-3 pt-2 d-flex gap-1 align-items-center border-0 border-top-0">
                    <i class="fa-regular fa-comments"></i>
                    <div>comments</div>
                    <span>(${content.comments_count})</span>
                    </div>
                    <div class="comments-zone${content.id} border-top d-none">
                        <h3 class="my-2">
                        comments
                        </h3>
                        <div class="d-flex flex-column justify-content-center comment-body${content.id}">
                        </div>
                        
                        <div class="input-group my-3">
                            <input id="comment-input${content.id}" class="form-control" placeholder="type your comment..." type="text" >
                            <button class="btn btn-primary" onclick="addComment(${content.id})" type="button">send</button>
                        </div>

                        <div onclick="hideComments(${content.id})" class="bg-secondary-subtle comment-btn hide-comments${content.id} text-center w-100">
                            <i class="fa-solid fa-caret-up fs-5"></i>
                        </div>

                    </div>
                </div>
            </div>
            
            <!-- end card body  -->
        </div>`;
        
        postContainer.innerHTML += post
        }
    })
}
getPosts()

//add new post 
let sendPost = document.querySelector(".send-post")
let img = document.querySelector("#post-img")

// show the img while creating post 
const postImgD = document.querySelector(".post-img-up");
img.addEventListener("change",()=>{
    const src = URL.createObjectURL(img.files[0])
    img.files[0] ? postImgD.innerHTML=`<img class="img-fluid" src="${src}" alt=""></img>`:"";
})
// end show the img while creating post 

// create new post 
sendPost.addEventListener("click",(e)=>{
    let text = document.querySelector("#post-text")
    const token = localStorage.getItem("token")
    e.preventDefault()
    let inf = new FormData()
    inf.append("body",text.value)
    img.files[0]? inf.append("image",img.files[0]):"";
    axios.post('https://tarmeezacademy.com/api/v1/posts', inf , {
        headers:{
            "Content-Type":"multipart/from-data",
            "authorization":`Bearer ${token}`
        }
    })
    .then(
        (res)=>{
            const modal = document.querySelector('#post-modal')
            modalHide(modal)
            let sc = setTimeout(() => {
                window.scrollY = 0
            }, 500);
            postContainer.innerHTML=""
            postImgD.innerHTML=""
            getPosts()
            text.value=""
            img.files.pop()
            clearTimeout(sc)
        },
        (rej)=>{
            const modal = document.querySelector('#post-modal')
            modalHide(modal)
            const message = rej.response.data.message
            getAlert(message)
        }
    )
    .catch((error)=>{
        const message = error.response.data.message
        getAlert(message)
    })
})
// end create new post
// end add new post

// pagination
let currPage = 1
let finalPage = 2
window.addEventListener("scroll",()=>{
    const endPage = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
    if (endPage && currPage < finalPage) {
        getPosts(false , currPage +=1)
    }
})
// end pagination

// comments  
function showComments(id) {
    axios.get(`https://tarmeezacademy.com/api/v1/posts/${id}`)
    .then((res)=>{
        const post = res.data.data
        const comments = post.comments
        let commentZone = document.getElementsByClassName(`comments-zone${id}`)
        let commentBody = document.getElementsByClassName(`comment-body${id}`)
        commentBody[0].innerHTML=""
        commentZone[0].classList.contains("d-none")?commentZone[0].classList.remove("d-none"):"";
        for (let i = 0; i < comments.length; i++) {
            commentBody[0].innerHTML+=`
            <div class="d-flex mt-3">
                <a href="profile.html" class="p-pic rounded-circle">
                    <img class="img-fluid h-100 w-100" src="${(comments[i].author.profile_image).length?comments[i].author.profile_image:"../images/defult.png"}" alt="">
                </a>
                <div class="text ms-2">
                    <div class="fs-5 fw-semibold">@${comments[i].author.name}</div>
                    <div>${comments[i].body}</div>
                </div>
            </div>
            `
        }
    })
}

function hideComments(id) {
    let commentZone = document.getElementsByClassName(`comments-zone${id}`)
    commentZone[0].classList.contains("d-none")?"":commentZone[0].classList.add("d-none");
}

function addComment(id) {
    let comment = document.querySelector(`#comment-input${id}`)
    myComment = {
        "body":comment.value
    }
    let token = localStorage.getItem("token")
    axios.post(`https://tarmeezacademy.com/api/v1/posts/${id}/comments`,myComment , {
        headers:{
            "authorization":`Bearer ${token}`
        }
    })
    .then((res)=>{
        showComments(id)
        comment.value=""
    })
}
// end comments 

// action list 
function showTheList(id) {
    let actionList = document.querySelector(`.action-list${id}`)
    actionList.classList.remove("d-none")
    document.body.addEventListener("click",(e)=>{
        if (actionList.classList.contains("d-none")) {
            ""
        }else{
            e.target.classList.contains("action")?"":actionList.classList.add("d-none")
        }
    })
}

function editPost(content) {
    let post = JSON.parse(decodeURIComponent(content))
    let editText = document.querySelector("#edit-text")
    let editImgUP = document.querySelector(".edit-img-up")
    let editImg = document.querySelector("#edit-img")
    let sendEdit = document.querySelector(".send-edit")
    editText.innerHTML= post.body
    
    
    let list = new DataTransfer();
    let file = new File(["content"], post.image);
    list.items.add(file);
    let myFileList = list.files;
    editImg.files = myFileList
    editImg.files[0]? editImgUP.innerHTML=`<img class="img-fluid" src="${editImg.files[0].name}" alt=""></img>`:"";
    editImg.addEventListener("change",(e)=>{
        const src = URL.createObjectURL(editImg.files[0])
        editImgUP.innerHTML=``;
        editImgUP.innerHTML=`<img class="img-fluid" src="${src}" alt=""></img>`;
    })
    
    sendEdit.addEventListener("click",(e)=>{
        const token = localStorage.getItem("token")
        e.preventDefault()
        let inf = new FormData()
        inf.append("body",editText.value)
        if (editImg.files[0].name !== "[object Object]" && post.image !== editImg.files[0].name) {
            inf.append("image",editImg.files[0]);
        }
        inf.append("_method","PUT")
        axios.post(`https://tarmeezacademy.com/api/v1/posts/${post.id}`, inf , {
            headers:{
                "Content-Type":"multipart/from-data",
                "authorization":`Bearer ${token}`,
            }
        })
        .then(
            (res)=>{
                const modal = document.querySelector('#edit-modal')
                modalHide(modal)
                let sc = setTimeout(() => {
                    window.scrollY = 0
                }, 500);
                postContainer.innerHTML=""
                editImgUP.innerHTML=""
                getPosts()
                editText.value=""
                clearTimeout(sc)
                console.log(post);
            },
            (rej)=>{
                const modal = document.querySelector('#edit-modal')
                modalHide(modal)
                let message = ""
                if (rej.response.data.error_message) {
                    message = rej.response.data.error_message
                }else{
                    message = rej.response.data.message
                }
                getAlert(message)
            }
        )
        .catch((error)=>{
            let message = ""
            if (error.response.data.error_message) {
                message = error.response.data.error_message
            }else{
                message = error.response.data.message
            }
            getAlert(message)
        })
    })
}

function deletePost(id) {
    let deleteBtn = document.querySelector(".send-delete")
    deleteBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        let token = localStorage.getItem("token")
    axios.delete(`https://tarmeezacademy.com/api/v1/posts/${id}`, {
        headers:{
            "authorization":`Bearer ${token}`
        }
    })
    .then(
        (res)=>{
            const modal = document.querySelector('#delete-modal')
            modalHide(modal)
            getPosts()
        },
        (rej)=>{
            const modal = document.querySelector('#delete-modal')
            modalHide(modal)
            let message = ""
            if (rej.response.data.error_message) {
                message = rej.response.data.error_message
            }else{
                message = rej.response.data.message
            }
            getAlert(message)
        }
    )
    })
}
// end action list