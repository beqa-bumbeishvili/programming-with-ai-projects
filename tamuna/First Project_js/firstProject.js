let generateButton = document.querySelector("#generate");
let passwordInput = document.querySelector(".input");
let copyButton=document.querySelector(".copy-button");
let alertMessage=document.getElementById('alert');

//using alertMessage instead of alert//
//Bellow I will use constant variables//
//use cap letters for const variables//
const PASSWORD_LENGTH=14;
const SYMBOLS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/~`-=_';

//avoid using  "function"//
//and use global variable//
generateButton.addEventListener("click", () => {
    passwordInput.value = generateRandomSymbols(PASSWORD_LENGTH);
    passwordInput.style.letterSpacing = '4px';
});

function generateRandomSymbols(length) {
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += SYMBOLS.charAt(Math.floor(Math.random() * SYMBOLS.length));
    }
    return randomString; 
}

//avoid using "function"//
//delete execCommand('copy') and use catch//
copyButton.addEventListener('click', () => {
    const password = passwordInput.value;
    if (password) {
        navigator.clipboard.writeText(password)
            .then(() => showAlert(password))
            .catch(() => showAlert("Failed to copy!"));
    }
});  

//avoid using "function"//
function showAlert(copiedPassword) {
    alertMessage.textContent = ` ${copiedPassword} copied!`;
    alertMessage.style.display = 'flex'; 
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000);
};
