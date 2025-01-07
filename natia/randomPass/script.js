const inputField = document.getElementById("input");
const copyIcon = document.getElementById("copy-icon");
const generateButton = document.querySelector(".btn");
const alertContainer = document.querySelector(".alert-container");

function generatePassword() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
  const passwordLength = 12;
  let password = "";
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  inputField.value = password;
}

function copyToClipboard() {
  if (inputField.value === "") {
    alert("No password to copy!");
    return;
  }

  navigator.clipboard.writeText(inputField.value).then(() => {
    alertContainer.textContent = `"${inputField.value}" Copied`;
    alertContainer.classList.add("active");

    setTimeout(() => {
      alertContainer.classList.remove("active");
    }, 2000);
  });
}

generateButton.addEventListener("click", generatePassword);
copyIcon.addEventListener("click", copyToClipboard);
