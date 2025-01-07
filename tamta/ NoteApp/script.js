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
        
        
        note.addEventListener('click', function(e) {
            
            if (e.detail === 1) { 
              
                if (this.textContent === 'Empty Note') {
                    this.textContent = '';
                }
                this.contentEditable = true;
                this.focus();
            }
        });
        
        note.addEventListener('blur', function() {
         
            if (this.textContent.trim() === '') {
                this.textContent = 'Empty Note';
            }
            this.contentEditable = false;
        });
        
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

    
    document.querySelectorAll('.note').forEach(note => {
        note.addEventListener('click', function(e) {
            if (e.detail === 1) {
                if (this.textContent === 'Empty Note') {
                    this.textContent = '';
                }
                this.contentEditable = true;
                this.focus();
            }
        });
        
        note.addEventListener('blur', function() {
            if (this.textContent.trim() === '') {
                this.textContent = 'Empty Note';
            }
            this.contentEditable = false;
        });
        
        note.addEventListener('dblclick', () => {
            noteToDelete = note;
            modal.style.display = 'flex';
        });
    });
});