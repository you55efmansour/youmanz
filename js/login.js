const logIn = document.getElementById("login");
const error = document.getElementById("error")
const userName = document.getElementById("user-name");
const password = document.getElementById("password");
const form = document.querySelector(".login-form");

const logInFunc = (e)=>{
    e.preventDefault()
    logIn.innerHTML=`<i class="fa-solid fa-spinner fa-spin"></i>`

    let inf = {
        "username": userName.value,
        "password": password.value,
    }
    axios.post('https://tarmeezacademy.com/api/v1/login', inf)
    .then(
        (res)=>{
            localStorage.setItem("token",res.data.token)
            localStorage.setItem("user",JSON.stringify(res.data))
            window.location='home.html'
            form.removeEventListener("submit",logInFunc)
        },
        (rej)=>{
            logIn.innerHTML=`Login`
            error.classList.remove("d-none")
            let message = rej.response.data.message
            error.innerHTML = `${message} <i class="fa-solid fa-triangle-exclamation ms-3 fa-beat-fade" style="color: red;"></i>`
        }
    )
}

form.addEventListener("submit",logInFunc)