let plus =document.querySelector(".plus");
let notepadSpace = document.querySelector(".notepadspace");

plus.addEventListener('click', createNewNote);

 //use function that declare varibles into it, and then //
 //create functions for these variables//  
function createNewNote() {
    const noteDiv = createNoteDiv();
    const textarea = createTextArea();
    
    noteDiv.appendChild(textarea);
    notepadSpace.prepend(noteDiv);

    //avoiding using "function"//
    noteDiv.addEventListener('dblclick', () => deleteNote(noteDiv));
}

function createNoteDiv() {
    const div = document.createElement("div");
    div.classList.add("childDiv");
    return div;
 }

function createTextArea() {
    const textarea = document.createElement("textarea");
    textarea.type = "text";            
    textarea.placeholder = "Empty Note";
    setTextAreaStyles(textarea);
    return textarea;
}
    
// Sets saperately the styles for the textarea element//
function setTextAreaStyles(textarea) {
    textarea.style.fontSize = "18px";
    textarea.style.background = "none";
    textarea.style.border = "none";
    textarea.style.opacity = "0.3";
    textarea.style.fontFamily = "Courier New, Courier, monospace";
    textarea.style.outline = "none";
    textarea.style.width = "270px";
    textarea.style.height = "180px";
    textarea.style.resize = "none";
    textarea.style.color = "darkblue";
    textarea.style.opacity = "1";
}
     
function deleteNote(noteDiv) {
    const confirmDelete = confirm("Do you want to delete this note?");
    if (confirmDelete) {
        noteDiv.remove();  
    }
}    


    
