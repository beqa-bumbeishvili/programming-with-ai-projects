document.querySelector('.PLUS').addEventListener('click', function() {
    const note = document.createElement('textarea');

    note.classList.add('note');
    note.placeholder = 'Empty Note';

    const box = document.querySelector('#box');
    box.appendChild(note);

    this.style.display = 'none';

    note.addEventListener('focus', function() {
        note.placeholder = '';
    });

    note.addEventListener('dblclick', function() {
        note.remove();
    });

    createPlusButton(note);
});

function createPlusButton(note) {
    const plusButton = document.createElement("button");
    plusButton.classList.add("PLUS");
    plusButton.textContent = "+";

    note.parentElement.appendChild(plusButton);

    plusButton.addEventListener("click", function() {
        const newNote = document.createElement("textarea");
        newNote.classList.add("note");
        newNote.placeholder = "Empty Note";

        const box = document.querySelector("#box");
        box.appendChild(newNote);

        createPlusButton(newNote);

        plusButton.style.display = "none";

        newNote.addEventListener("focus", function() {
            newNote.placeholder = "";
        });

        newNote.addEventListener("dblclick", function() {
            newNote.remove();
        });
    });
}