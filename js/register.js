const axios = require('axios/dist/node/axios.cjs');
let registerForm = document.getElementById("register-form");
let error = document.getElementById("error")
const name = document.getElementById("name");
const userName = document.getElementById("user-name");
const email = document.getElementById("email");
const password = document.getElementById("password");

registerForm.addEventListener("submit",(e)=>{
    e.preventDefault()
    let inf = {
        "username": userName.value,
        "password": password.value,
        "name": name.value,
        "email": email.value,
    }
    axios.post('https://tarmeezacademy.com/api/v1/register', inf)
    .then(
        (res)=>{
            pattern.test(`${password.value}`) === true?window.location='/login.html':error.innerHTML = `Password should be more than or equal 6 <i class="fa-solid fa-triangle-exclamation ms-3 fa-beat-fade" style="color: red;"></i>`;
        },
        (rej)=>{
            error.classList.remove("d-none")
            let message = rej.response.data.message
            error.innerHTML = `${message} <i class="fa-solid fa-triangle-exclamation ms-3 fa-beat-fade" style="color: red;"></i>`
        }
    )
})