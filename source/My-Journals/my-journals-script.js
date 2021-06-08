import { getAllJournalsAsync, createNewJournal } from "./../../public/backend/script.js";
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

//prompts new journal
addJournal.addEventListener('click', () => {
    modal.style.display = 'block';
});

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
  // call function to add tags to journal
  renderJournals('User2');
  journalName.value="";
});

// const createJournalForm = document.getElementById('create-journal-form');
// createJournalForm.addEventListener("submit", (e) => {
//   e.preventDefault();
//   let data = new FormData(createJournalForm);
//   console.log(data);
// });



closeSpan.addEventListener('click', () => {
  modal.style.display = 'none';
});

cancelBtn.addEventListener('click', () => {
  modal.style.display = 'none';
});

window.addEventListener('click', (event) => {
  if (event.target === modal) {
    modal.style.display = 'none';
  }
});

function addJournalColor(color) {
  if (color.startsWith() != '#') {
    color = '#' + color;
  }
  return color;
}

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
 * 
 * @param {*} user 
 */
async function renderJournals(user) {
  // const reponse = await firebaseGetReuest();
  const journalContainer = document.getElementById('journal-entries');
  journalContainer.innerHTML = '';
  let newJournal = {};

  const journals = await getAllJournalsAsync(user); // dummy function for now
  console.log(journals);
  for (let item in journals) {
    journals[item].title = item;
    newJournal = document.createElement('journal-collection');

    // add color to journal
    // newJournal.style.background = addJournalColor(journals[item].color);
    newJournal.style.backgroundColor=parseColor(journals[item].color);
    console.log(journals[item].color);
    newJournal.entry = journals[item];
    newJournal.addEventListener('click', () => {
      window.location.href = './../Journal-Entries/entries.html?journal=dummy';
      console.log(journals[item].entries);
      // router.setState('entries', false, item, null);
    });

    journalContainer.appendChild(newJournal);
  }

  // sampleJournals.forEach((sample) => {
  //   newJournal = document.createElement('journal-collection');
  //   newJournal.entry = sample;
  //   newJournal.addEventListener('click', () => {
  //     window.location.href = './../Journal-Entries/entries.html';
  //   });

  //   journalContainer.appendChild(newJournal);
  // });
}

/**
 * 
 * @param {*} entries entries to render
 */
function renderEntries(entries) {
  const entriesContainer = document.querySelector('.entries-container');
  // iterate through object
  // each entry is an object
  for (let entry in entries) {
    
  }
}



renderJournals('User2');

// async function getAllJournalsAsync(user) {
//   const blogs = [];
//   let journals = '';
//   return new Promise((resolve) => {
//     database.ref().child(`users/${user}/journals/`).get()
//     .then(snapshot => {
//       journals = snapshot.val();
//       resolve(journals);
//     })
//   })
// }

// async function getEntries(user, journalId) {
//   let blogs = [];
//   return new Promise((resolve) => {
//     database.ref().child(`users/${user}/journals/${journalId}/entries`).get()
//     .then((snapshot) => {
//       blogs = snapshot.val();
//     })
//     .then(() => blogs);
//   });
//   // return database.ref().child(`users/${user}/journals/${journalId}/entries`).get()
//   //   .then((snapshot) => {
//   //     blogs = snapshot.val();
//   //   })
//   //   .then(() => blogs);
// }

// console.log(getEntries('User1', 'CSE110'));
