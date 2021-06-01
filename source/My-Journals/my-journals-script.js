import { getAllJournals } from "./../../public/backend/script.js";

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

const sampleJournals = [
  {
    title: 'Journal1',
    date: Date.now(),
    todos: ['todo1', 'todo2'],
  },
  {
    title: 'Journal2',
    date: Date.now(),
    todos: ['todo1'],
  },
  {
    title: 'Journal3',
    date: Date.now(),
    todos: ['todo1', 'todo2', 'todo3', 'todo4'],
  },
];

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
      window.location.href = './../Journal-Entries/entries.html';
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

renderJournals();

async function getAllJournalsAsync(user) {
  const blogs = [];
  let journals = '';
  return new Promise((resolve) => {
    database.ref().child(`users/${user}/journals/`).get()
    .then(snapshot => {
      journals = snapshot.val();
      resolve(journals);
    })
  })
}
