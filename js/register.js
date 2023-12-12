let registerForm = document.getElementById("register-form");
let error = document.getElementById("error")

registerForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    const name = document.getElementById("name");
    const userName = document.getElementById("user-name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let inf = {
        "username": userName.value,
        "password": password.value,
        "name": name.value,
        "email": email.value,
    }
    axios.post('https://tarmeezacademy.com/api/v1/register', inf)
    .then(
        (res)=>{window.location='/login.html'},
        (rej)=>{
            error.classList.remove("d-none")
            let message = rej.response.data.message
            error.innerHTML = message
        }
    )
})