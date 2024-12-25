
// ღილაკის და input-ის ელემენტების მიღება
const button = document.querySelector('.generateButton');
const passwordInput = document.querySelector('#input');

// ღილაკზე დაჭერის დროს პაროლის გენერაცია და ჩაწერა input-ში
button.addEventListener('click', () => {
    const randomPassword = generateRandomPassword(14); // 14-ნიშნა პაროლი
    passwordInput.value = randomPassword; // პაროლის ჩაწერა input-ში
    document.getElementById('popup').innerText = randomPassword + " copied!";
});

// SVG ელემენტზე დაჭერისას
document.querySelector('.copySymbol').addEventListener('click', copyTextToClipboard, showPopup);

//ფუნქცია რომელიც აკეთებს პოპაპს
function showPopup() {
    console.log("papapi");
    popup.classList.add("popup-show");

    setTimeout(function () {
        popup.classList.remove("popup-show");
    }, 2000);
}

//პაროლის დასაგენერირებელი ფუნქცია
function generateRandomPassword(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
}

// ფუნქცია, რომელიც აკოპირებს ტექსტს კლიპბორდზე
function copyTextToClipboard() {
    // მიიღეთ input ელემენტი
    const inputElement = document.querySelector('#input');

    // გაააქტიურეთ input ელემენტი (თუ ის readonlyა)
    inputElement.select();
    inputElement.setSelectionRange(0, 99999); // იმისათვის, რომ მთელი ტექსტი აირჩეს

    // ასლირება კლიპბორდზე
    try {
        navigator.clipboard.writeText(inputElement.value);
        showPopup();
    } catch (err) {
        console.log('Failed to copy text: ', err);
    }
}

// ქართული კომენტარები ამოიღე, უცხოური შეიძლება ოღონდ მარტო მაშინ როცა კოდით არაა ადვილად წაკითხვადი




