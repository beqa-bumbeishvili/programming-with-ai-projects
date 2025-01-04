document.addEventListener('DOMContentLoaded', () => {
    const notesContainer = document.querySelector('.notes-container');
    const addNoteButton = document.querySelector('.add-note');
    const modal = document.querySelector('.modal');
    const okButton = document.querySelector('.ok-button');
    const cancelButton = document.querySelector('.cancel-button');
    let noteToDelete = null;

    function createNote() {
        const note = document.createElement('div');
        note.className = 'note';
        note.textContent = 'Empty Note';
        
        note.addEventListener('dblclick', () => {
            noteToDelete = note;
            modal.style.display = 'flex';
        });
        
        return note;
    }

    addNoteButton.addEventListener('click', () => {
        const note = createNote();
        notesContainer.insertBefore(note, addNoteButton);
    });

    okButton.addEventListener('click', () => {
        if (noteToDelete) {
            noteToDelete.remove();
            noteToDelete = null;
        }
        modal.style.display = 'none';
    });

    cancelButton.addEventListener('click', () => {
        noteToDelete = null;
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            noteToDelete = null;
        }
    });

    // Add event listeners to initial example notes
    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('dblclick', () => {
            noteToDelete = note;
            modal.style.display = 'flex';
        });
    });
});