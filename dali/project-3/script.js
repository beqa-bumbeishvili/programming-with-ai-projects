const screen = document.getElementById('screen');
const buttons = document.querySelectorAll('button');
let currentInput = ''; // მიმდინარე ინპუტი

// Button-ების კლიენტის გამოყენება
buttons.forEach(button => {
  button.addEventListener('click', function() {
    const buttonText = button.innerText;

    if (buttonText === 'C') {
      // ამომიღებს ეკრანიდან ყველა ტექსტი
      currentInput = '';
      screen.value = currentInput;
    } else if (buttonText === '=') {
      // გამოსატანს გამოთვლის შედეგი
      try {
        currentInput = eval(currentInput);
        screen.value = currentInput;
      } catch (error) {
        screen.value = 'Error';
        currentInput = '';
      }
    } else {
      // დამატება/ჩაწერა ეკრანზე
      currentInput += buttonText;
      screen.value = currentInput;
    }
  });
});