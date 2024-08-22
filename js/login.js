
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

