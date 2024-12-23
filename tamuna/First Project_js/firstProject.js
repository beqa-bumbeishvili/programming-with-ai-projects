
let generateButton = document.querySelector("#generate");
let passwordInput = document.querySelector(".input");
let copyButton=document.querySelector(".copy-button");
let alert=document.getElementById('alert');

generateButton.addEventListener("click", function() {
    passwordInput.value = generateRandomSymbols(14);
    passwordInput.style.letterSpacing = '4px';
});

function generateRandomSymbols(length) {
    const symbols = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?/~`-=_';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += symbols.charAt(Math.floor(Math.random() * symbols.length));
    }
    return randomString; 
}

copyButton.addEventListener('click', function() {
    const password = passwordInput.value;
        if (password) {
            passwordInput.select();
            document.execCommand('copy');

            showAlert(password); 
            }
});
function showAlert(copiedPassword) {
    alert.textContent = ` ${copiedPassword} copied!`;
    alert.style.display = 'flex'; 
    setTimeout(function() {
        alert.style.display = 'none';
    }, 3000);
}
