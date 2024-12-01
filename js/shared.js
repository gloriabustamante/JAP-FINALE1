const navListItem = document.querySelector('#liLogout');
const navbarToggler = document.querySelector('.navbar-toggler');

document.addEventListener("DOMContentLoaded", function () {
    displayNavBarName()
    authentication()
    aplicarModoDesdeLocalStorage()
    actualizarBadge();
});

const displayNavBarName = () => {
    let navUsername = localStorage.getItem("username");
    const btnMenu= document.getElementById('userDropdown')
    if (navUsername) {
        btnMenu.textContent=navUsername       
} }

const logout = () => {
    navListItem.addEventListener('click', function () {
        localStorage.removeItem('username')
        localStorage.removeItem('secondlastName')
        localStorage.removeItem('secondName')
        localStorage.removeItem('email')
        localStorage.removeItem('phone')
        localStorage.removeItem('firstlastName')
        localStorage.removeItem('firstName')
        localStorage.removeItem('modoOscuro');
        localStorage.removeItem('carrito');
        localStorage.removeItem('proRel1');
        localStorage.removeItem('proRel2');
        localStorage.removeItem("token")
    })
}

const authentication = () => {
    if (localStorage.getItem("username") == null) {
        window.location = "login.html"
    }
}

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

const aplicarModoDesdeLocalStorage = () => {
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

const toggleDarkMode = () => {
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

// Guarda el estado del modo en localStorage solo cuando se presiona el botón "Guardar cambios"

saveButton.addEventListener('click', () => {
    if (typeof modoOscuroSeleccionado !== 'undefined') {
        localStorage.setItem('modoOscuro', modoOscuroSeleccionado.toString());
    }
});

// Asignar la función de toggle a los clics de las flechas

leftArrow.addEventListener('click', toggleDarkMode);
rightArrow.addEventListener('click', toggleDarkMode);

function actualizarBadge() {
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    let totalItems = 0;

    carrito.forEach(item => {
        totalItems += item.cantidad;
    });

    document.getElementById('cart-badge').textContent = totalItems;
}

function RedireccionarPorCategoriaAProducts(event){
    event.preventDefault();
    let idCategoria = event.currentTarget.getAttribute("data-id");
    localStorage.setItem("catID", idCategoria);
    window.location.href = "products.html";
}