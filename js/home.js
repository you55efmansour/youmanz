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
            <h5 class="card-header d-flex align-items-center gap-3">
                <a href="profile.html" class="p-pic rounded-circle">
                    <img class="img-fluid h-100 w-100" src="${(content.author.profile_image).length?content.author.profile_image:"../images/defult.png"}" alt="">
                </a>
                <div>@${content.author.name}</div>
                <p class="text-black-50 fw-semibold flex-grow-1 text-end fs-14">${content.created_at}</p>
            </h5>
            <!-- start card body  -->
            <div class="card-body">
                <div class="post-img mb-3">
                    <img class="img-fluid rounded-4" src="${content.image}" alt="">
                </div>
              <div class="fw-semibold">${content.body}</div>
              <div class="comment border-top mt-3 pt-2 d-flex gap-1 align-items-center">
              <!-- Button trigger modal -->
                <button type="button" class="comment border-top mt-3 pt-2 d-flex gap-1 align-items-center border-0 border-top-0" data-bs-toggle="modal" data-bs-target="#exampleModal">
                <i class="fa-regular fa-comments"></i>
                  <div>comments</div>
                  <span>(${content.comments_count})</span>
                </button>

                <!-- Modal -->
                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog d-flex align-items-center justify-content-center h-100">
                    <div class="modal-content">
                        <h2 class="mb-4 ms-2">comments</h2>
                        <div class="container">
                        <h5 class="card-header d-flex align-items-center gap-3">
                        <a href="profile.html" class="p-pic rounded-circle">
                            <img class="img-fluid h-100 w-100" src="${(content.author.profile_image).length?content.author.profile_image:"../images/defult.png"}" alt="">
                        </a>
                        <div>@${content.author.name}</div>
                        </h5>
                        </div>
                    </div>
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
img.addEventListener("change",()=>{
    const postImgD = document.querySelector(".post-img-up");
    const src = URL.createObjectURL(img.files[0])
    img.files[0] ? postImgD.innerHTML=`<img class="img-fluid" src="${src}" alt=""></img>`:"";
})

// create new post 
sendPost.addEventListener("click",(e)=>{
    let text = document.querySelector("#post-text").value
    const token = localStorage.getItem("token")
    e.preventDefault()
    let inf = new FormData()
    inf.append("body",text)
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
            getPosts()
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

// pagination
let currPage = 1
let finalPage = 2
window.addEventListener("scroll",()=>{
    const endPage = window.innerHeight + window.scrollY >= document.documentElement.offsetHeight;
    if (endPage && currPage < finalPage) {
        getPosts(false , currPage +=1)
    }
})
//