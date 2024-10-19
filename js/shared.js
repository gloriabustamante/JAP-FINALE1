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
        localStorage.removeItem('secondlastName')
        localStorage.removeItem('secondName')
        localStorage.removeItem('email')
        localStorage.removeItem('phone')
        localStorage.removeItem('firstlastName')
        localStorage.removeItem('firstName')
        localStorage.removeItem('modoOscuro');
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

//FUNCION MODO OSCURO

let leftArrow = document.getElementById('leftArrow');
let rightArrow = document.getElementById('rightArrow');
let label_toggle = document.getElementById('label_toggle');
let saveButton = document.getElementById('buttonEditarPerfil');

// Variable para almacenar temporalmente el modo seleccionado

let modoOscuroSeleccionado;

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


function toggleDarkMode() {
    const modoOscuro = document.body.classList.contains('dark');

    if (modoOscuro) {
        document.body.classList.remove('dark');
        label_toggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
        label_toggle.style.color = "black";
        modoOscuroSeleccionado = false;
    } else {
        document.body.classList.add('dark');
        label_toggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
        label_toggle.style.color = "orange";
        modoOscuroSeleccionado = true; 
    }
}

// Guardar el estado del modo en localStorage solo cuando se presiona el botón "Guardar cambios"

saveButton.addEventListener('click', () => {
    if (typeof modoOscuroSeleccionado !== 'undefined') {
        localStorage.setItem('modoOscuro', modoOscuroSeleccionado.toString());
    }
});

// Asignar la función de toggle a los clics de las flechas

leftArrow.addEventListener('click', toggleDarkMode);
rightArrow.addEventListener('click', toggleDarkMode);
