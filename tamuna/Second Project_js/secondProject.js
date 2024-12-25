let plus =document.querySelector(".plus");
let notepadSpace = document.querySelector(".notepadspace");

plus.addEventListener('click', function() {
    let childDiv=document.createElement("div");
    childDiv.classList.add("childDiv");
    
    let textarea = document.createElement("textarea");
    textarea.type = "text";            
    textarea.placeholder = "Empty Note";
    textarea.style.fontSize="18px";
    textarea.style.background="none";
    textarea.style.border="none";
    textarea.style.opacity="0.3";
    textarea.style.fontFamily="Courier New, Courier, monospace;"
    textarea.style.outline="none";
    textarea.style.width="270px";
    textarea.style.height="180px";
    textarea.style.resize="none";
    textarea.style.color="darkblue";
    textarea.style.opacity="1";
    
    notepadSpace.prepend(childDiv);
    childDiv.appendChild(textarea);
    notepadSpace.insertBefore(childDiv, plus);

childDiv.addEventListener('dblclick', function() {
    let confirmDelete = confirm("Do you want to delete this note?");
    if (confirmDelete) {
        childDiv.remove();  
    }
});
});
