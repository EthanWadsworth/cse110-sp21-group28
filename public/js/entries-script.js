const entryDisplayContainer = document.querySelector('.entry-modal-container');
let entryContainer = document.querySelector('.entry-container');

// handles all page click events
function pageDisplayer(newEntry, newEntryModal) {
  // add click listener for modal displayer
  newEntry.addEventListener('click', () => {
    const idNum = newEntry.id.substring(1, newEntry.id.length);
    let modalDisplayer = document.getElementById(`m${idNum}`);
    modalDisplayer = modalDisplayer.shadowRoot.querySelector('.entry-modal');
    modalDisplayer.style.display = 'block';
  });

  // adds window event listener to close correct modal
  window.addEventListener('click', (event) => {
    const modalDisplayer = document.getElementById(newEntryModal.id);
    const modalDisplayerHandler = modalDisplayer.shadowRoot.querySelector('.entry-modal');
    if (event.target === modalDisplayer) {
      modalDisplayerHandler.style.display = 'none';
    }
  });
}

const sampleEntries = [
  {
    title: 'Entry1',
    start_date: Date.now(),
    description: 'bujo project',
    tags: ['todo1', 'todo2'],
  },
  {
    title: 'Entry2',
    start_date: Date.now(),
    description: 'bujo project',
    tags: ['todo1'],
  },
  {
    title: 'Entry3',
    start_date: Date.now(),
    description: 'bujo project',
    tags: ['todo1', 'todo2', 'todo3', 'todo4'],
  },
];

// renders the entries
let counter = 1;
sampleEntries.forEach((entry) => {
  entryContainer = document.querySelector('.entries-container');
  const newEntry = document.createElement('journal-entry');
  newEntry.entry = entry;

  const newEntryModal = document.createElement('entry-display');
  newEntryModal.notes = entry;

  // set element ids for access to correct event listeners
  newEntry.id = `e${counter}`;
  newEntryModal.id = `m${counter}`;

  entryDisplayContainer.appendChild(newEntryModal);

  // setup click listeners
  pageDisplayer(newEntry, newEntryModal);

  entryContainer.appendChild(newEntry);
  counter += 1;
});


