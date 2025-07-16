function getId() {
    const params = new URLSearchParams(window.location.search)
    const id = params.get("userid")
    return id
}
// get user info start
const infCard = document.querySelector(".inf-card")
function getUserInfo() {
    let id = getId();
    console.log(id);
    
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}`)
    .then(
        (res)=>{
            let inf = res.data.data
            let infData =`
            <div class="card-body d-flex flex-column flex-md-row align-items-center">
                        <div href="profile.html" class="prof-pic border border-3 border-dark overflow-hidden rounded-circle">
                            <img class="img-fluid h-100 w-100" src="${inf.profile_image}" alt="">
                        </div>
                        <div class="user-inf ms-3 me-4 fw-semibold">
                            <div class="my-1">${inf.email}</div>
                            <div class="my-1">${inf.username}</div>
                            <div class="my-1">${inf.name}</div>
                        </div>
                        <div class="user-num-inf ms-5">
                            <div class="fs-1 fw-semibold">${inf.posts_count}<span class="text-black-50 fw-normal fs-6">Posts</span></div>
                            <div class="fs-1 fw-semibold">${inf.comments_count}<span class="text-black-50 fw-normal fs-6">Comments</span></div>
                        </div>
            </div>
            `
            infCard.innerHTML=infData
            const userName = document.querySelector(".posts-name")
            userName.innerHTML=`${inf.name}`
        }
    )
}
getUserInfo()?"":infCard.innerHTML=`<i class="fa-solid fa-spinner p-3 fs-1 text-center fa-spin"></i>`;
// get user info end

// get user posts start
const postCard = document.querySelector(".prof-posts") 
function getUserPosts() {
    let id = getId();
    axios.get(`https://tarmeezacademy.com/api/v1/users/${id}/posts`)
    .then(
        (res)=>{
            let post = res.data.data
            postCard.innerHTML =""
            for (let i = 0; i < post.length; i++) {
                
                let postData =`
                <div class="card my-4 shadow">
                <h5 class="card-header card-header${post[i].id} d-flex align-items-center gap-3 position-relative">
                    <a href="profile.html" class="p-pic rounded-circle">
                        <img class="img-fluid h-100 w-100" src="${(post[i].author.profile_image).length?post[i].author.profile_image:"../images/defult.png"}" alt="">
                    </a>
                    <div>@${post[i].author.name}</div>
                    <p class="text-black-50 fw-semibold flex-grow-1 text-end fs-14">${post[i].created_at}</p>

                    <div class="position-absolute rounded action action-list action-list${post[i].id} p-1 d-none">
                        <button type="button" class="btn btn-success my-1 d-block w-100" onclick="editPost('${encodeURIComponent(JSON.stringify(post[i]))}')" data-bs-toggle="modal" data-bs-target="#edit-modal">
                            edit
                        </button>
                        <button type="button" onclick="deletePost(${post[i].id})" class="btn btn-danger my-1 d-block w-100" data-bs-toggle="modal" data-bs-target="#delete-modal">
                            delete
                        </button>
                    </div>
                </h5>
            <!-- start card body  -->
                <div class="card-body">
                    <div class="post-img mb-3">
                        <img class="img-fluid rounded-4" src="${post[i].image}" alt="">
                    </div>
                    <div class="fw-semibold">${post[i].body}</div>
                    <div class="comment${post[i].id} border-top mt-3 pt-2 d-flex flex-column gap-1 justify-content-center">
                        <!-- Button trigger modal -->
                        <div onclick="showComments(${post[i].id})" class="comment-btn${post[i].id} comment-btn border-top mt-3 pt-2 d-flex gap-1 align-items-center border-0 border-top-0">
                        <i class="fa-regular fa-comments"></i>
                        <div>comments</div>
                        <span>(${post[i].comments_count})</span>
                        </div>
                        <div class="comments-zone${post[i].id} border-top d-none">
                            <h3 class="my-2">
                            comments
                            </h3>
                            <div class="d-flex flex-column justify-content-center comment-body${post[i].id}">
                            </div>
                            
                            <div class="input-group my-3">
                                <input id="comment-input${post[i].id}" class="form-control" placeholder="type your comment..." type="text" >
                                <button class="btn btn-success" onclick="addComment(${post[i].id})" type="button">send</button>
                            </div>
    
                            <div onclick="hideComments(${post[i].id})" class="bg-secondary-subtle comment-btn hide-comments${post[i].id} text-center w-100">
                                <i class="fa-solid fa-caret-up fs-5"></i>
                            </div>
    
                        </div>
                    </div>
                </div>
            
            <!-- end card body  -->
        </div>
                `
                postCard.innerHTML+=postData
                addActions(post[i].id)
            }
    }
    )
}
getUserPosts()?"":postCard.innerHTML=`<i class="fa-solid text-center w-100 p-3 fs-1 fa-spinner fa-spin"></i>`;
// get user posts start 

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
                getUserInfo()
                getUserPosts()
                editText.value= res.data.data.body
                clearTimeout(sc)
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
            getUserInfo()
            getUserPosts()
        }
    )
    })
}
// end action list

function addActions(id) {
    let hC = document.querySelector(`.card-header${id}`)
    let local = localStorage.getItem("user")
    let myUserId = JSON.parse(local)
    console.log(getId());
    console.log(myUserId.user.id);
    if (myUserId.user.id == getId()) {
        hC.innerHTML+=`
        <div class="action-btn action" onclick="showTheList(${id})">
        <i class="fa-solid fa-ellipsis-vertical fs-14 p-2 action"></i>
        </div>
    `
    }
}