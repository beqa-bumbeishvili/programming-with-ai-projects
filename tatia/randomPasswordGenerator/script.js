function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

function copyTextToClipboard() {

    const inputElement = document.querySelector('#input');
    inputElement.select();
    inputElement.setSelectionRange(0, 99999);
    try {
        navigator.clipboard.writeText(inputElement.value);
        showPopup();
    } catch (err) {
        console.log('Failed to copy text: ', err);
    }
}

function showPopup() {
    console.log("papapi");
    popup.classList.add("popup-show");

    setTimeout(function () {
        popup.classList.remove("popup-show");
    }, 2000);
}


const button = document.querySelector('.generateButton');
const passwordInput = document.querySelector('#input');


button.addEventListener('click', () => {
    const randomPassword = generateRandomPassword(14);
    passwordInput.value = randomPassword;
    document.getElementById('popup').innerText = randomPassword + " copied!";
});

document.querySelector('.copySymbol').addEventListener('click', copyTextToClipboard, showPopup);














