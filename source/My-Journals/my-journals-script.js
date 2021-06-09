import { getAllJournalsAsync, createNewJournal, deleteJournal, insertTagsMany } from "./../../public/backend/script.js";
import { router } from './router.js';

window.addEventListener('popstate', e => {
  if (e.state?.page && e.state.page.startsWith('entry')) {
    router.setState('entry', true, Number(e.state.page.substr(6,e.state.page.length)));
  } else if (e.state?.page && e.state.page) {

  } else {
    router.setState(e.state?.page, true);
  }
});

const database = firebase.database();

const modal = document.getElementById('new-journal');

const createBtn = document.getElementById('create');
const addJournal = document.getElementById('add-journal');
const cancelBtn = document.getElementById('cancel');

const closeSpan = document.querySelector('.close');

// for adding a tag 
const tagBtn = document.getElementById('tag-btn');

tagBtn.addEventListener('click', (e) => {
  const tagTextField = document.getElementById('tag-name');
  const tagsList = document.getElementById('tags-list');

  let addTag = true;
  for (let i = 0; i < tagsList.childNodes.length; i++) {
    if (tagTextField.value === tagsList.childNodes[i].textContent) {
      addTag=false;
      break;
    }
  }

  if (tagTextField.value != '' && addTag) {      
    let newTag = document.createElement('li');
    newTag.appendChild(document.createTextNode(tagTextField.value));
    tagsList.appendChild(newTag);
    tagTextField.value = '';
  }
});

//prompts new journal
addJournal.addEventListener('click', () => {
    modal.style.display = 'block';
});

/**
 * Adds tags to the  journal specified by user account and journal id
 * 
 * @param {string} user user id for which user account to add updates to
 * @param {string} journalId journal id to add tags to
 */
function addJournalTags(user, journalId) {
  const tagsList = document.getElementById('tags-list');

  // if the tags list for the new journal is not empty
  if (tagsList.childNodes.length != 0) {
    // take strings out of tags currently added in ul list
    let tagStrings = [];
    for (let i = 0; i < tagsList.childNodes.length; i++) {
      tagStrings.push(tagsList.childNodes[i].textContent);
    }
    
    // add tags to new journal via database post
    insertTagsMany(user, journalId, tagStrings);
  }
}

// creates new journal 
createBtn.addEventListener('click', () => {
  const colorSelect = document.getElementById("colors");
  const journalName = document.getElementById("journal-name");
  if(journalName.value === ""){
    alert('Must name journal');
    return;
  } 

  // add and then rerender
  createNewJournal('User2', journalName.value, '', colorSelect.value);
  addJournalTags('User2', journalName.value);
  // call function to add tags to journal
  renderJournals('User2');
  modal.style.display = 'none';
  resetModal();
});

/**
 * Resets the modal to default values on create journal cancels
 */
function resetModal() {
  // wipe out data in tags list
  const tagsList = document.getElementById('tags-list');
  tagsList.innerHTML = '';

  // wipe out any data in the tags text field
  const tagTextField = document.getElementById('tag-name');
  tagTextField.value = '';

  // wipe out text in the journal name field
  const journalNameField = document.getElementById('journal-name');
  journalNameField.value = '';

  // set default select color back to red
  const colorSelect = document.getElementById('colors');
  colorSelect.value = 'red';
}


closeSpan.addEventListener('click', () => {
  modal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  resetModal();
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    resetModal();
  }
});

//delete close button
const dClose = document.getElementById('delete-close');
dClose.addEventListener('click', () => {
    document.getElementById('delete-journal').style.display = 'none';
});

//delete cancel button
const dCancel = document.getElementById('dj-cancel');
dCancel.addEventListener('click', () => {
  document.getElementById('delete-journal').style.display = 'none';
});

const dConfirm = document.getElementById('dj-confirm');
dConfirm.addEventListener('click', (event) => {
  let closeModal = event.target.parentNode;
  // gets the delete message string
  let deleteMsg = closeModal.children[1].textContent;
  console.log(deleteMsg);

  // extract correct journal from the delete message 
  deleteMsg = deleteMsg.substring(15, deleteMsg.length - 1);
  console.log(deleteMsg);

  // now we need to grab all the nodes and delete one from the list with the name
  removeJournal(deleteMsg);
  const deleteModal = document.getElementById('delete-journal');
  deleteModal.style.display = 'none';
});

// deletes journal
function removeJournal(journalId) {
  // first grab all of the journals
  let journals = document.querySelectorAll('journal-collection');

  let journalToDelete = '';

  // find the correct journal-collection element to delete
  for (let i = 0; i < journals.length; i++) {
    if (journalId === journals[i].id) {
      journalToDelete = journals[i];
      break;
    }
  }

  // only delete if the journal exists
  if (journalToDelete != '') {
    deleteJournal('User2', journalId);
    journalToDelete.remove();
  }
}



/**
 * Converts entered color for journals into hex color
 * 
 * @param {string} color (red, blue, green, purple) 
 * @returns {string} hex code for the color passed in
 */
function parseColor(color){
  switch(color) {
    case 'red':
      return '#EF6666';
    case 'blue':
      return '#5D93E3';
    case 'green':
      return '#74B9A8';
    case 'purple':
      return '#A374F0';
  }
}

/**
 * Controller to render all of the journals on the journals page and also
 * add all event listeners based on what journals the specific user has in 
 * their account
 * 
 * @param {string} user specific user account id
 */
async function renderJournals(user) {
  // const reponse = await firebaseGetReuest();
  const journalContainer = document.getElementById('journal-entries');
  const deleteModal = document.getElementById('delete-journal');
  journalContainer.innerHTML = '';
  let newJournal = {};

  const journals = await getAllJournalsAsync(user); // dummy function for now
  console.log(journals);
  for (let item in journals) {
    journals[item].title = item;
    newJournal = document.createElement('journal-collection'); 
    newJournal.id = item;

    // delete journal button
    const closeJournal = newJournal.shadowRoot.querySelector('span');
    closeJournal.id = item + 'close';
    closeJournal.addEventListener('click', function(event) {
      event.stopPropagation(); // not sure why we need this
      deleteModal.style.display = 'block';

      // sets correct journal id
      let deleteJournalName = event.target.parentNode.getRootNode().host.id;
      // this grabs the correct span we want and the id set for the journal
      // associated with the delete button
      const deleteMsg = document.getElementById("delete-message");
      deleteMsg.textContent = "Delete Journal " + deleteJournalName + "?";
    });

    // add color to journal
    newJournal.style.backgroundColor=parseColor(journals[item].color);
    newJournal.entry = journals[item];

    // event to send to entries page for journal clicked on
    newJournal.addEventListener('click', (event) => {
      let journalId = event.target.id;
      window.location.href = `./../Journal-Entries/entries.html?journal=${journalId}`;
    });

    journalContainer.appendChild(newJournal);
  }
}

renderJournals('User2');

export {parseColor};