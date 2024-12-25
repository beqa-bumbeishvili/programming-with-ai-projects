let password = document.getElementById("input");

let copy = document.querySelector(".fa-copy");
let alertContainer = document.querySelector(".alert-container");


function genPassword() {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()_-+=[]{}|;:><ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let passwordLength = 14;
    let password = "";

    for (let i = 0; i <= passwordLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        password += chars.substring(randomNumber, randomNumber + 1);
    }

    document.getElementById("input").value = password;
    return password;
}

function copyPassword() {
    password.select();
    let copiedPassword = document.getElementById("input").value;
    navigator.clipboard.writeText(copiedPassword);

    alertContainer.innerText = `${copiedPassword} copied!`;
}


copy.addEventListener("click", () => {
    copyPassword();

    if (document.getElementById("input").value) {
        alertContainer.classList.remove("active");
        setTimeout(() => {
            alertContainer.classList.add("active")
        }, 2000);
    }

})

/*
JS ფიდბექი:
1. ctrl + shift + f გამოიყენე კოდის გასწორებისთვის
2. საჭირო ადგილას ხაზები გამოტოვე ხოლმე, ლოგიკურად ერთნაირი კოდი ერთად დაწერე, მაგ. ახალ ფუნქციას რომ იწყებ, ერთი ხაზი გამოტოვე
კოდის ბოლო ნაწილი ასე უფრო ადვილად წაკითხვადი იქნებოდა

function copyPassword() {
    password.select();

    let copiedPassword = document.getElementById("input").value;
    navigator.clipboard.writeText(copiedPassword);

    alertContainer.innerText = `${copiedPassword} copied!`;
}

copy.addEventListener("click", () => {
    copyPassword();

    if (document.getElementById("input").value) {
        alertContainer.classList.remove("active");

        setTimeout(() => {
            alertContainer.classList.add("active")
        }, 2000);
    }
});


*/