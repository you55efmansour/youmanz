function modalHide(modal) {
    const modalIntance = bootstrap.Modal.getInstance(modal)
    modalIntance.hide()
}
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


function getProf(id) {
    window.location = `profile.html?userid=${id}`
}


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
                <a href="#" onclick="getProf(${comments[i].author.id})" class="p-pic rounded-circle">
                    <img class="img-fluid h-100 w-100" src="${(comments[i].author.profile_image).length?comments[i].author.profile_image:"../images/defult.png"}" alt="">
                </a>
                <div class="text ms-2">
                    <a href="#" onclick="getProf(${comments[i].author.id})" class="fs-5 fw-semibold">@${comments[i].author.name}</a>
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

function addComment(e,id) {
    e.preventDefault()
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

const token = localStorage.getItem("token")

token?"":window.location="index.html"