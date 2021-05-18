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

async function renderJournals() {
  // const reponse = await firebaseGetReuest();
  const journalContainer = document.getElementById('journal-entries');
  let newJournal = {};

  sampleJournals.forEach((sample) => {
    newJournal = document.createElement('journal-entry');
    newJournal.entry = sample;

    journalContainer.appendChild(newJournal);
  });
}

renderJournals();
