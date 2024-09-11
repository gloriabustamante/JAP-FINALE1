const navbarToggler = document.querySelector('.navbar-toggler');

// Agregamos un evento al hacer clic en el botón
navbarToggler.addEventListener('click', function () {
    // Alternamos la clase 'toggler-open' en el botón para identificar el estado abierto/cerrado
    navbarToggler.classList.toggle('toggler-open');
});

