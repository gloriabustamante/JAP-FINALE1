document.addEventListener('DOMContentLoaded', function () {
    let username = document.querySelector("#username");
    let password = document.querySelector("#password");
    let buttonLogin = document.querySelector("#buttonLogin");
    let usernameLabel = document.getElementById('usernameLabel');
    let passwordLabel = document.getElementById('passwordLabel');

    function alternarBotones() {
        if (username.value && password.value) {
            buttonLogin.disabled = false;
            buttonLogin.classList.remove('buttonDisabled');
            buttonLogin.classList.add('button');
            localStorage.setItem("username", username)
        } else {
            buttonLogin.disabled = true;
            buttonLogin.classList.add('buttonDisabled');
        }
    }

    function alternarEstados(input, label) {
        label.classList.toggle('labelError', !input.value);
        input.classList.toggle('inputError', !input.value);
    }

    function alternarInputs() {
        username.addEventListener('blur', function () { alternarEstados(username, usernameLabel) });
        password.addEventListener('blur', function () { alternarEstados(password, passwordLabel) });
        username.addEventListener('input', function () { alternarEstados(username, usernameLabel) });
        password.addEventListener('input', function () { alternarEstados(password, passwordLabel) });
    }

    username.addEventListener('input', alternarBotones);
    password.addEventListener('input', alternarBotones);
    alternarInputs();
    alternarBotones();

});

function login(event) {
    event.preventDefault();
    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;

    if (username.length < 30 && username.length > 0  && password != null) {
        localStorage.setItem("username", username);
        window.location.href = "index.html";
    } else {
        alert("Error");
    }
};
