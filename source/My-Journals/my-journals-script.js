import { getAllJournalsAsync } from "./../../public/backend/script.js";
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

const createBtn = document.getElementById('create-button');
const cancelBtn = document.getElementById('cancel');

const closeSpan = document.querySelector('.close');

createBtn.addEventListener('click', () => {
  modal.style.display = 'block';
});

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

async function renderJournals() {
  // const reponse = await firebaseGetReuest();
  const journalContainer = document.getElementById('journal-entries');
  let newJournal = {};

  const journals = await getAllJournalsAsync('User1'); // dummy function for now
  console.log(journals);
  for (let item in journals) {
    journals[item].title = item;
    newJournal = document.createElement('journal-collection');

    // add color to journal
    newJournal.style.background = addJournalColor(journals[item].color);
    newJournal.entry = journals[item];
    newJournal.addEventListener('click', () => {
      // window.location.href = './../Journal-Entries/entries.html';
      console.log(journals[item].entries);
      router.setState('entries', false, item, null);
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



renderJournals();

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
