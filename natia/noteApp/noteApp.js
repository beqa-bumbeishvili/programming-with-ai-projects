const addButton = document.querySelector(".btn");
const appContainer = document.querySelector(".app");

addButton.addEventListener("click", () => {
  const newNote = document.createElement("textarea");
  newNote.classList.add("note");
  newNote.placeholder = "Empty Note";
  newNote.style.height = "200px";

  newNote.addEventListener("dblclick", () => {
    if (confirm("Do you want to delete this note?")) {
      appContainer.removeChild(newNote);
    }
  });

  appContainer.insertBefore(newNote, addButton);
});
