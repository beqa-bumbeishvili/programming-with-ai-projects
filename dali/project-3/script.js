const screen = document.getElementById("screen");
const buttons = document.querySelectorAll("button");
let currentInput = "";

buttons.forEach((button) => {
    button.addEventListener("click", function() {
        const buttonText = button.innerText;

        if (buttonText === "C") {
            currentInput = "";
            screen.value = currentInput;
        } else if (buttonText === "=") {
            try {
                currentInput = eval(currentInput);
                screen.value = currentInput;
            } catch (error) {
                screen.value = "Error";
                currentInput = "";
            }
        } else {
            currentInput += buttonText;
            screen.value = currentInput;
        }
    });
});