let notesContainer = document.getElementById("app");
let addNoteButton = notesContainer.querySelector(".btn")

let notes = getNotes();
if (notes.length === 0) {
    saveNotes([]);
};

getNotes().forEach(note => {
    let noteElement = createNoteElement(note.id, note.content);
    notesContainer.insertBefore(noteElement, addNoteButton);
})

addNoteButton.addEventListener("click", () => addNote());

function getNotes() {
    return JSON.parse(localStorage.getItem("stickynotes-notes") || "[]");
}

function saveNotes(notes) {
    localStorage.setItem("stickynotes-notes", JSON.stringify(notes));
}

function createNoteElement(id, content) {
    let element = document.createElement("textarea")

    element.classList.add("note");
    element.value = content;
    element.placeholder = "Empty Note"

    element.addEventListener("change", () => {
        updateNote(id, element.value);
    })

    element.addEventListener("dblclick", () => {
        let doDelete = confirm("Do you want to delete this note?");

        if (doDelete) {
            deleteNote(id, element);
        }
    })

    return element;
}

function addNote() {
    let Notes = getNotes();
    let noteObject = {
        id: Math.floor(Math.random() * 1000000),
        content: ""
    };

    let noteElement = createNoteElement(noteObject.id, noteObject.content);
    notesContainer.insertBefore(noteElement, addNoteButton);

    Notes.push(noteObject);
    saveNotes(Notes);
}

function updateNote(id, newContent) {
    let notes = getNotes();
    let targetNote = notes.filter(note => note.id == id)[0];

    targetNote.content = newContent;
    saveNotes(notes);
};

function deleteNote(id, element) {
    let notes = getNotes().filter(note => note.id != id);

    saveNotes(notes);
    notesContainer.removeChild(element);
};