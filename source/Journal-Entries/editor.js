var editor = document.getElementById('editor-area');
const ulBtn = document.getElementById('ulBtn');
const olBtn = document.getElementById('olBtn');

// TODO - need to add delete button for each item rendered


// render new list of type specified
// param is true of false depending on type of list wanted
function createList(type) {
    let newList = "";
    if (type === 'ol') {
        newList = document.createElement('ol');
    } else {
        newList = document.createElement('ul');
    }
    let container = document.createElement('span');
    addDelete(container);
    newList.contentEditable = true;
    var li = document.createElement("li");
    li.appendChild(document.createTextNode(""));
    newList.appendChild(li);
    container.appendChild(newList);
    editor.appendChild(container);
    console.log('list created');
}

// can create any element type specified by type
function createItem(type, isText = false) {
    if (type === 'ul' || type === 'ol') {
        createList(type);
    } else {
        let container = document.createElement('span');
        addDelete(container);
        let element = document.createElement(type);
        if (isText) {
            element.setAttribute('data-placeholder', "Insert text here...");
            // element.textContent = "Place your content here";
        }
        container.appendChild(element);
        element.contentEditable = true;
        editor.appendChild(container);
    }
}

// add the delete button to the correct container
// being added 
function addDelete(container) {
    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.setAttribute('onclick', 'remove(this.parentElement)');
    container.appendChild(deleteBtn);
}

// remove the entire span 
function remove(el) {
    let element = el;
    element.remove();
}