import {
  getAllJournalsAsync, createNewJournal, deleteJournal, insertTagsMany, editJournal,
} from '../backend/backend_script.js';

/**
 * Converts entered color for journals into hex color
 *
 * @param {string} color (red, blue, green, purple)
 * @returns {string} hex code for the color passed in
 */
function parseColor(color) {
  switch (color) {
    case 'red':
      return '#EF6666';
    case 'blue':
      return '#5D93E3';
    case 'green':
      return '#74B9A8';
    case 'purple':
      return '#A374F0';
    default:
      return '#EF6666';
  }
}

/**
 * Removes specified journal from the user's account
 *
 * @param {*} journalId name of journal to be removed
 */
function removeJournal(journalId) {
  // first grab all of the journals
  const journals = document.querySelectorAll('journal-collection');

  let journalToDelete = '';

  // find the correct journal-collection element to delete
  for (let i = 0; i < journals.length; i += 1) {
    if (journalId === journals[i].id) {
      journalToDelete = journals[i];
      break;
    }
  }

  // only delete if the journal exists
  if (journalToDelete !== '') {
    deleteJournal('User1', journalId);
    journalToDelete.remove();
  }
}

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
  if (journals) {
    const keys = Object.keys(journals);

    keys.forEach((key) => {
      journals[key].title = key;
      newJournal = document.createElement('journal-collection');
      newJournal.id = key;

      // delete journal button
      const closeJournal = newJournal.shadowRoot.querySelector('span');
      closeJournal.id = `${key}close`;
      closeJournal.addEventListener('click', (event) => {
        event.stopPropagation(); // not sure why we need this
        deleteModal.style.display = 'block';

        // sets correct journal id
        const deleteJournalName = event.target.parentNode.getRootNode().host.id;
        // this grabs the correct span we want and the id set for the journal
        // associated with the delete button
        const deleteMsg = document.getElementById('delete-message');
        deleteMsg.textContent = `Delete Journal ${deleteJournalName}?`;
      });

      // add color to journal
      newJournal.style.backgroundColor = parseColor(journals[key].color);
      newJournal.entry = journals[key];

      // event to send to entries page for journal clicked on
      newJournal.addEventListener('click', (event) => {
        const journalId = event.target.id;
        window.location.href = `../pages/my-journal-entries.html?journal=${journalId}`;
      });

      journalContainer.appendChild(newJournal);
    });
  }
}

const modal = document.getElementById('new-journal');

const createBtn = document.getElementById('create');
const addJournal = document.getElementById('add-journal');
const cancelBtn = document.getElementById('cancel');

const closeSpan = document.querySelector('.close');

// for adding a tag
const tagBtn = document.getElementById('tag-btn');

// When choosing to add a tag, check if tag already exists
tagBtn.addEventListener('click', () => {
  const tagTextField = document.getElementById('tag-name');
  const tagsList = document.getElementById('tags-list');

  let addTag = true;

  // loop through currently added tags to see if the one being added
  // is a duplicate
  for (let i = 0; i < tagsList.childNodes.length; i += 1) {
    if (tagTextField.value === tagsList.childNodes[i].textContent) {
      addTag = false;
      break;
    }
  }

  // Add if the tag is not empty and is not a duplicate
  if (tagTextField.value !== '' && addTag) {
    const newTag = document.createElement('li');
    newTag.appendChild(document.createTextNode(tagTextField.value));
    tagsList.appendChild(newTag);
    tagTextField.value = '';
  }
});

// prompts new journal
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
  if (tagsList.childNodes.length !== 0) {
    // take strings out of tags currently added in ul list
    const tagStrings = [];
    for (let i = 0; i < tagsList.childNodes.length; i += 1) {
      tagStrings.push(tagsList.childNodes[i].textContent);
    }

    // add tags to new journal via database post
    insertTagsMany(user, journalId, tagStrings);
  }
}

// creates new journal
createBtn.addEventListener('click', () => {
  const colorSelect = document.getElementById('colors');
  const journalName = document.getElementById('journal-name');

  // check if the journal name is empty
  if (journalName.value === '') {
    alert('Must name journal');
    return;
  }

  // add and then rerender
  createNewJournal('User1', journalName.value, '', colorSelect.value);
  editJournal('User1', journalName.value, 'color', colorSelect.value);
  addJournalTags('User1', journalName.value);

  // call function to add tags to journal
  renderJournals('User1');
  modal.style.display = 'none';
  resetModal();
});

// hide add journal modal if user clicks on X button
closeSpan.addEventListener('click', () => {
  modal.style.display = 'none';
});

// hide add journal modal if user clicks cancel button
cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
  resetModal();
});

// hide add journal modal if user clicks outside of it
window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
    resetModal();
  }
});

// delete close button
const dClose = document.getElementById('delete-close');
dClose.addEventListener('click', () => {
  document.getElementById('delete-journal').style.display = 'none';
});

// delete cancel button
const dCancel = document.getElementById('dj-cancel');
dCancel.addEventListener('click', () => {
  document.getElementById('delete-journal').style.display = 'none';
});

// If the user confirms that they want to delete a specific journal,
// then that journal is removed from the database and the journals
// are rerendered
const dConfirm = document.getElementById('dj-confirm');
dConfirm.addEventListener('click', (event) => {
  const closeModal = event.target.parentNode;
  // gets the delete message string
  let deleteMsg = closeModal.children[1].textContent;
  // extract correct journal from the delete message
  deleteMsg = deleteMsg.substring(15, deleteMsg.length - 1);

  // now we need to grab all the nodes and delete one from the list with the name
  removeJournal(deleteMsg);
  const deleteModal = document.getElementById('delete-journal');
  deleteModal.style.display = 'none';
});

renderJournals('User1');

// log the user out when the logout button is clicked
document.getElementById('logout').addEventListener('click', () => {
  firebase.auth().signOut();
  window.location = '../index.html';
});

// check for a logged in user
firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location = '../index.html'; // If User is not logged in, redirect to login page
  }
});
