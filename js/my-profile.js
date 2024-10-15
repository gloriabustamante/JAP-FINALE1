document.addEventListener("DOMContentLoaded", function () {
    displayData()
});

//Creo la funcion para mostrar el username en el perfil, pero la llamo displayData ya que luego la usariamos para traer otros datos también.

function displayData() {
    let usernameInput = document.querySelector('#username');
    let username = localStorage.getItem("username");

    usernameInput.value = username;
}

const flechas = document.querySelectorAll('.flecha'); 
const icon = document.getElementById('icon');

// Función para cambiar el icono
function toggleIcon() {
  if (icon.classList.contains('fa-moon')) {
    icon.classList.remove('fa-moon'); 
    icon.classList.add('fa-sun'); 
  } else {
    icon.classList.remove('fa-sun'); 
    icon.classList.add('fa-moon');
  }
}

flechas.forEach(flecha => {
  flecha.addEventListener('click', toggleIcon);
});
