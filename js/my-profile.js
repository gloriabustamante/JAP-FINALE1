document.addEventListener("DOMContentLoaded", function () {
  displayData();
  alternarInputs();
});

//Creo la funcion para mostrar el username en el perfil, pero la llamo displayData ya que luego la usariamos para traer otros datos también.

const displayData = () => {
  let usernameInput = document.querySelector('#username');
  let username = localStorage.getItem("username");
  usernameInput.value = username || ''; 
}

// Función para cambiar el icono

const flechas = document.querySelectorAll('.flecha'); 
const icon = document.getElementById('icon');

const toggleIcon = () =>  {
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

// Función para reconocer si los inputs tienen error

const alternarEstados = (input, label) => {
  const esEmail = input.type === 'email';
  const tieneError = !input.value.trim() || (esEmail && input.validating && !validarEmail(input.value)); // Valida si el email es inválido o el campo está vacío
  label.classList.toggle('labelError', tieneError);
  input.classList.toggle('inputError', tieneError);
  return !tieneError; 
}

// Función para validar un email usando regex

const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email); 
}

// Función para cambiar el boton de deshabilitado a habilitado 

const actualizarEstadoBoton = () => {
  const inputs = [
    { input: firstName, label: firstNameLabel },
    { input: firstlastName, label: firstlastNameLabel },
    { input: email, label: emailLabel }
  ];

  let todoValido = true;

  inputs.forEach(({ input, label }) => {
    const esValido = alternarEstados(input, label);
    if (!esValido) {
      todoValido = false;
    }
  });

  const button = document.querySelector('#buttonEditarPerfil');
  button.disabled = !todoValido;  
};

// Función para cambiar los estilos de los inputs y labels

const alternarInputs = () => {
  const inputs = [
    { input: firstName, label: firstNameLabel },
    { input: firstlastName, label: firstlastNameLabel },
    { input: email, label: emailLabel }
  ];

  inputs.forEach(({ input, label }) => {
    input.validating = false;

    input.addEventListener('blur', function () {
      input.validating = true;
      alternarEstados(input, label);
      actualizarEstadoBoton(); 
    });

    input.addEventListener('input', function () {
      input.validating = false;
      alternarEstados(input, label);
      actualizarEstadoBoton();  
    });
  });
};


// Función para guardar datos en localStorage solo si los inputs son válidos

const guardarCambios = () => {
  const inputs = [
    { input: firstName, label: firstNameLabel },
    { input: firstlastName, label: firstlastNameLabel },
    { input: email, label: emailLabel }
  ];

  let todoValido = true;


  inputs.forEach(({ input, label }) => {
    const esValido = alternarEstados(input, label); 
    if (!esValido) {
      todoValido = false; 
    }
  });
 

  if (todoValido) {
    localStorage.setItem("firstName", firstName.value);
    localStorage.setItem("firstlastName", firstlastName.value);
    localStorage.setItem("email", email.value);
    alert('Los cambios se han guardado correctamente.');
  } else {
    alert('Por favor, corrige los campos incorrectos antes de guardar.');
  }
}

document.querySelector('#buttonEditarPerfil').addEventListener('click', guardarCambios);
