let logIn = document.getElementById("login");
let error = document.getElementById("error")
const userName = document.getElementById("user-name");
const password = document.getElementById("password");

logIn.addEventListener("click",(e)=>{
    e.preventDefault()
    let inf = {
        "username": userName.value,
        "password": password.value,
    }
    axios.post('https://tarmeezacademy.com/api/v1/login', inf)
    .then(
        (res)=>{
            window.location='home.html'
        },
        (rej)=>{
            error.classList.remove("d-none")
            let message = rej.response.data.message
            error.innerHTML = `${message} <i class="fa-solid fa-triangle-exclamation ms-3 fa-beat-fade" style="color: red;"></i>`
        }
    )
})