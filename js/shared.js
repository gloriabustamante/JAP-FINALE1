document.addEventListener("DOMContentLoaded", function () {
    displayNavBarName()
    displayLogOut()
    authentication()
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

    navListItem.addEventListener('click', function () {
        localStorage.removeItem('username')
    })
}



function authentication() {
    if (localStorage.getItem("username") == null) {
        window.location = "login.html"
    }
}
const navbarToggler = document.querySelector('.navbar-toggler');

// Agregamos un evento al hacer clic en el botón
navbarToggler.addEventListener('click', function () {
    // Alternamos la clase 'toggler-open' en el botón para identificar el estado abierto/cerrado
    navbarToggler.classList.toggle('toggler-open');
});

