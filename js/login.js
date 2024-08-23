document.addEventListener('DOMContentLoaded', function () {
    let usernameInput = document.querySelector("#usernameLogin");
    const passwordInput = document.querySelector("#passwordLogin");
    const buttonLogin = document.querySelector("#buttonLogin");

    function toggleButtonState() {
        if (usernameInput.value.trim() !== '' && passwordInput.value.trim() !== '') {
            buttonLogin.disabled = false; 
            buttonLogin.classList.remove('buttonDisabled'); 
            buttonLogin.classList.add('button');
            
        } else {
            buttonLogin.disabled = true; 
            buttonLogin.classList.remove('button'); 
            buttonLogin.classList.add('buttonDisabled'); 
        }
    }

    usernameInput.addEventListener('input', toggleButtonState);
    passwordInput.addEventListener('input', toggleButtonState);

    toggleButtonState();
});
