document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("autos").addEventListener("click", function () {
        localStorage.setItem("catID", 101);
        window.location = "products.html"
    });
    document.getElementById("juguetes").addEventListener("click", function () {
        localStorage.setItem("catID", 102);
        window.location = "products.html"
    });
    document.getElementById("muebles").addEventListener("click", function () {
        localStorage.setItem("catID", 103);
        window.location = "products.html"
    });

    function displayNavBarName() {
        let navListItem = document.querySelector('#navName');
        let navUsername = localStorage.getItem("username");
       
    if (navUsername) {
            let navLink = document.createElement('a');
            navLink.textContent = navUsername;
            navListItem.appendChild(navLink);
            navLink.setAttribute('class', 'nav-link')
            navLink.setAttribute('href', 'my-profile.html')
        }
    }

    function displayLogOut() {
        let navListItem = document.querySelector('#logout');
        let navUsername = localStorage.getItem("username");
       
    if (navUsername) {
            let navLink = document.createElement('a');
            navLink.textContent = 'Cerrar Sesión';
            navListItem.appendChild(navLink);
            navLink.setAttribute('class', 'nav-link')
            navLink.setAttribute('href', 'login.html')
        }
    }
    displayNavBarName()
    displayLogOut()
});


//Esta funcion te devuelve al login si no tiene usuario en localstorage
document.addEventListener("DOMContentLoaded", function () {
    if (localStorage.getItem("username") == null) {
        window.location = "login.html"
    }
});

