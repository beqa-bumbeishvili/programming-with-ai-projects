function generatePassword() {
  const length = 14;
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:',.<>?";
  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  document.getElementById("password").value = password;
}

function copyPassword() {
  const passwordField = document.getElementById("password");
  passwordField.select();
  passwordField.setSelectionRange(0, 99999);
  document.execCommand("copy");
  
  const notification = document.createElement("div");
  notification.classList.add("copy-notification");
  notification.innerHTML = `${passwordField.value} copied!`; 
  let a;
  document.body.appendChild(notification);
  
  setTimeout(() => {
      notification.remove();
  }, 3000);

}


  
  