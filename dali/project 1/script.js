function generateRandomPassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = "";
    const passwordLength = 14; 
    for (let i = 0; i < passwordLength; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    } 
    return password;
}
let button = document.querySelector("#button");
button.addEventListener("click", function(){
    document.getElementById("search").value = generateRandomPassword();
});

function showPasswordAlert(password) {
    const alert = document.getElementById("password");
    alert.textContent = `${password} copied!`;
    alert.style.display = 'block';
    setTimeout(() => {
      alert.style.display = 'none';
    }, 2000); 
  }
  document.getElementById("icon").addEventListener('click', function() {
    const searchValue = document.getElementById("search").value;
    const password = searchValue || generateRandomPassword();
    showPasswordAlert(password);
  });


  // ctrl + shift + f_ით გაასწორე კოდი
  // ხაზებით გამოყავი ახალი ფუნქციები, for loop და ყველა ლოგიკურად ცალკე მდგარი კოდის ნაწილები. მაგ. generateRandomPassword ასე დაიწერებოდა
//   function generateRandomPassword() {
//     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
//     let password = "";
//     const passwordLength = 14; 

//     for (let i = 0; i < passwordLength; i++) {
//         const randomIndex = Math.floor(Math.random() * characters.length);
//         password += characters[randomIndex];
//     } 

//     return password;
// }