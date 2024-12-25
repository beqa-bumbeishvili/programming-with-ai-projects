document.getElementById("generate-password").addEventListener("click", function () {
    const passwordLength = 14;
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";
    let password = "";

    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }   
        document.getElementById("input").value = password;
    });

    const generateButton = document.getElementById("generate-password");
    const inputField = document.getElementById("input");
    const copyIcon = document.getElementById("fav");
    const notification = document.getElementById("notification");
// აქ ორი ცარიელი ხაზი ზედმეტია

    document.getElementById("fav").addEventListener("click", function () {
    const passwordField = document.getElementById("input");
    const password = passwordField.value;
          // აქ ორი ცარიელი ხაზი ზედმეტია 
        
        const notification = document.getElementById("notification");
        notification.style.display = "block";
        setTimeout(() => {
            notification.style.display = "none";
        }, 3000);

        notification.textContent = `copied!: ${password}`;
        notification.style.display = "block";
    });

    // ცვლადების სახელები კაია, ctrl + shift + f_ით გაასწორე კოდი