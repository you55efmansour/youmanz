axios.get("https://tarmeezacademy.com/api/v1/posts?limit=5")
.then((res)=>{ 
    let posts = res.data.data
    let postContainer = document.getElementById("posts")
    for (let i = 0; i < posts.length; i++) {
        let content = posts[i];
        let post = `<div class="card my-4 shadow">
        <h5 class="card-header d-flex align-items-center gap-3">
            <div class="p-pic rounded-circle">
                <img class="img-fluid" src="${content.author.profile_image}" alt="">
            </div>
            <div>@${content.author.name}</div>
            <p class="text-black-50 fw-semibold flex-grow-1 text-end fs-14">${content.created_at}</p>
        </h5>
        <!-- start card body  -->
        <div class="card-body">
            <div class="post-img mb-3">
                <img class="img-fluid rounded" src="${content.image}" alt="">
            </div>
          <div class="fw-semibold">${content.body}</div>
          <div class="border-top mt-3 pt-2 d-flex gap-1 align-items-center">
              <i class="fa-regular fa-comments"></i>
              <div>comments</div>
              <span>(${content.comments_count})</span>
          </div>
        </div>
        <!-- end card body  -->
      </div>`;

      postContainer.innerHTML += post
        
    }
})