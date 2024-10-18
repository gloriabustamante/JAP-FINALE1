document.addEventListener("DOMContentLoaded", function () {
    displayNavBarName()
    displayLogOut()
    authentication()
});

function displayNavBarName() {
    let navUsername = localStorage.getItem("username");
    const btnMenu = document.getElementById('emailDropdown')
    if (navUsername) {
    btnMenu.textContent = navUsername;
          
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
        localStorage.removeItem('secondlastName')
        localStorage.removeItem('secondName')
        localStorage.removeItem('email')
        localStorage.removeItem('phone')
        localStorage.removeItem('firstlastName')
        localStorage.removeItem('firstName')
    })
}

function authentication() {
    if (localStorage.getItem("username") == null) {
        window.location = "login.html"
    }
}
const navbarToggler = document.querySelector('.navbar-toggler');

navbarToggler.addEventListener('click', function () {
    navbarToggler.classList.toggle('toggler-open');
});

// Función para habilitar el modo oscuro

let leftArrow = document.getElementById('leftArrow');
let rightArrow = document.getElementById('rightArrow');
let label_toggle = document.getElementById('label_toggle');

function aplicarModoDesdeLocalStorage() {
    const modoOscuro = localStorage.getItem('modoOscuro') === 'true';

    if (modoOscuro) {
        document.body.classList.add('dark');
        label_toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        label_toggle.style.color = "orange";
    } else {
        document.body.classList.remove('dark');
        label_toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        label_toggle.style.color = "black";
    }
}

    document.addEventListener('DOMContentLoaded', aplicarModoDesdeLocalStorage);

function enableDarkMode() {
    document.body.classList.add('dark');
    label_toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    label_toggle.style.color = "orange";
    localStorage.setItem('modoOscuro', 'true');
}

// Función para deshabilitar el modo oscuro (modo normal)

function disableDarkMode() {
    document.body.classList.remove('dark');
    label_toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    label_toggle.style.color = "black";
    localStorage.setItem('modoOscuro', 'false');
}

rightArrow.addEventListener('click', enableDarkMode);
leftArrow.addEventListener('click', disableDarkMode);