 // Select the button and the app container
    const addButton = document.querySelector('.btn');
     const appContainer = document.querySelector('.app');

 // Add event listener to the button
     addButton.addEventListener('click', () => {
     // Create a new textarea element
     const newNote = document.createElement('textarea');
     newNote.classList.add('note'); // Add the same class as the original notes
     newNote.placeholder = 'Empty Note'; // Add a placeholder
     newNote.style.height = '200px'; // Ensure the height matches the CSS

     // Add double-click functionality to remove the note
    newNote.addEventListener('dblclick', () => {
         if (confirm('Do you want to delete this note?')) {
             appContainer.removeChild(newNote);
         }
     });

     // Insert the new note before the button
     appContainer.insertBefore(newNote, addButton);
 });

// ფიდბექი:
//  ctrl + shift + f გაუშვი ატვირთვამდე
// ზედმეტი კომენტარები მოაშორე, კომენტარი მარტო მაშინ გამოიყენე როცა კოდი არაა საკითხვადი