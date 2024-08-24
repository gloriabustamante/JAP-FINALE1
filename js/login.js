document.addEventListener('DOMContentLoaded', function () {
    let   username = document.querySelector("#username");
    let password = document.querySelector("#password");
    let buttonLogin = document.querySelector("#buttonLogin");

    function alternarbotones() {
        if (username.value.trim() !== '' && password.value.trim() !== '') {
            buttonLogin.disabled = false; 
            buttonLogin.classList.remove('buttonDisabled'); 
            buttonLogin.classList.add('button');
            localStorage.setItem("username", username)
        } else {
            buttonLogin.disabled = true; 
            buttonLogin.classList.remove('button'); 
            buttonLogin.classList.add('buttonDisabled'); 
        }
    }

    username.addEventListener('input', alternarbotones);
    password.addEventListener('input', alternarbotones);

    alternarbotones();
});

function login() {

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (username != null && password != null) {
        localStorage.setItem("username", username);
        window.location.href = "index.html";
    } else {
        alert("Error");
    }
};
