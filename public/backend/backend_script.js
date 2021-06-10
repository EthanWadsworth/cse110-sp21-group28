/* eslint-disable linebreak-style */
/* eslint-disable no-restricted-syntax */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const firebaseConfig = {
  apiKey: 'AIzaSyB8xbOp9a5gOZPhAu1DePXimXbJG1RRCeE',
  authDomain: 'bullet-journal-110.firebaseapp.com',
  databaseURL: 'https://bullet-journal-110-default-rtdb.firebaseio.com',
  projectId: 'bullet-journal-110',
  storageBucket: 'bullet-journal-110.appspot.com',
  messagingSenderId: '290407354761',
  appId: '1:290407354761:web:1612b4616b4930443f1158',
  measurementId: 'G-F831EK3HBB',
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Database
const database = firebase.database();

// Create a new user
function createNewUser(user, password) {
  firebase.database().ref(`users/${user}`).set({
    password,
  });
}

/** Function to get new JournalId when inserting a new journal
 *
 * @param {*} user Specified user
* */
function getNewJournalId(user) {
  return database.ref().child(`users/${user}/journalId`).get()
    .then((snapshot) => {
      firebase.database().ref(`users/${user}/journalId`).set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}

/** Function to create a new journal for the specified user
 *
 * @param {*} user Specified user
 * @param {*} journalName Journal name
 * @param {*} journalDesc Journal description
* */
function createNewJournal(user, journalName, journalDesc) {
  if (user === '' || journalName === '') {
    throw new Error('error');
  }
  firebase.database().ref(`users/${user}/journals/${journalName}`).set({
    journalDescription: journalDesc,
    color: '#FFFFFF',
  });
}

/** Function to delete a specified journal from a specific user
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal description
* */
function deleteJournal(user, journalId) {
  if (user === '' || journalId === '') {
    throw new Error('error');
  } else {
    database.ref(`users/${user}/journals/${journalId}`).remove();
  }
}

/** Function to edit a journal (name/description)
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
 * @param {*} spec Specifies if name or desciption is being changed (should be color/entires)
 * @param {*} specChange String for what the spec should be changed to
* */
function editJournal(user, journalId, spec, specChange) {
  // console.log(`Editing journal ${journalId}'s ${spec}`);
  if (user === '' || journalId === '' || spec === '' || specChange === '') {
    throw new Error('error');
  } else {
    database.ref(`users/${user}/journals/${journalId}`).update({ [spec]: specChange });
  }
}

/** Function to create a new tag
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
 * @param {*} tag tag to insert for this journal
* */
function newTag(user, journalId, tag) {
  const tags = database.ref().child(`users/${user}/journals/${journalId}/tags/`);
  let seen = false;
  database.ref().child(`users/${user}/journals/'${journalId}/tags`).get()
    .then((snapshot) => {
      snapshot.forEach((tagSnap) => {
        const val = tagSnap.val();
        if (val === tag) {
          // Tag already exists
          seen = true;
        }
      });
    })
    .then(() => {
      if (!seen) {
        tags.push(tag);
        resolve(tags);
        console.error('Tag already exists in this journal!');
      }
    });
}

/** Function to delete a tag
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
 * @param {*} tag tag to delete for this journal
* */
function deleteTag(user, journalId, tag) {
  if (user === '' || journalId === '') {
    throw new Error('error');
  }
  const tags = database.ref().child(`users/${user}/journals/${journalId}/tags/`);
  database.ref().child(`users/${user}/journals/${journalId}/tags`).get()
    .then((snapshot) => {
      snapshot.forEach((tagSnap) => {
        const { key } = tagSnap;
        const val = tagSnap.val();
        if (val === tag) {
          tags.child(`${key}`).remove();
        }
      });
    });
}

/** Function to get a new entries ID
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
* */
function getNewTodoId(user, journalId) {
  return database.ref().child(`users/${user}/journals/${journalId}`).child('postId').get()
    .then((snapshot) => {
      firebase.database().ref(`users/${user}/journals/${journalId}/postId`).set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}

/** Function to create a new entry
 *
 * @param {*} user Specified user
 * @param {*} todoName Name of the entry
 * @param {*} todoDesc Description of the entry
 * @param {*} start Start date of the entry (7/12/2020 format)
 * @param {*} end End date of the entry (7/12/2020 format)
 * @param {*} todotags List of tags that this entry falls under
 * @param {*} journalId Journal name
* */
function createNewEntry(user, todoName, todoDesc, start, end, todotags, journalId) {
  if (user === '' || journalId === '' || todoName === '') {
    throw new Error('error');
  }
  const todoId = todoName.replace(/\s+/g, '').toLowerCase();
  firebase.database().ref(`users/${user}/journals/${journalId}/entries/${todoId}`).set({
    title: todoName,
    description: todoDesc,
    start_date: start,
    end_date: end,
    tags: todotags,
    isDone: false,
    parentJournal: journalId,
  });
  // todotags.forEach((tag) => {
  //   newTag(user, journalId, tag);
  // });
}

/** Function to delete an entry
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
 * @param {*} entryId Name of the entry to delete from the database
* */
function deleteTodo(user, journalId, entryId) {
  if (user === '' || journalId === '' || entryId === '') {
    throw new Error('error');
  }
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).remove();
}

/** Function to edit a Entry
 *
 * @param {*} user Specified user
 * @param {*} journalId Journal name
 * @param {*} entryId Name of the entry to edit
 * @param {*} specChange Object of the spec and what it is being changed to for specific entry
 * @param {*} spec Spec that is being changed
* */
function editTodo(user, journalId, entryId, specChange, spec) {
  if (user === '' || journalId === '' || entryId === '' || specChange === '') {
    throw new Error('error');
  }
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).update(specChange);
}

/** Function to get all journal objects of a user
 *
 * @param {*} user Specified user
* */
function getAllJournals(user) {
  const blogs = [];
  const journals = database.ref().child(`users/${user}/journals/`).get()
    .then((snapshot) => {
      const journal = snapshot.val();
      return journal;
    });
}

/** Function to get all entries specified by journal and user
 *
 * @param {*} user Specified user
 * @param {*} journalId Specified journal
* */
async function getEntries(user, journalId) {
  return new Promise((resolve) => {
    const blogs = [];
    database.ref().child(`users/${user}/journals/${journalId}/entries`).get()
      .then((snapshot) => {
        resolve(snapshot.val());
      });
  });
}

/**  Function to get all Todos of a user REGARDLESS of journal
 *
 * @param {*} user Specified user
* */
async function getAllEntries(user) {
  return new Promise((resolve) => {
    const blogs = [];
    database.ref().child(`users/${user}/journals/`).on('value', (snapshot) => {
      if (snapshot.val()) {
        Object.keys(snapshot.val()).forEach(async (journId) => {
          const entries = await getEntries(user, journId);
          if (!entries) {
            return;
          }
          for (const [key, value] of Object.entries(entries)) {
            blogs.push({ [key]: value });
          }
          resolve(blogs);
        });
      }
    });
  });
}

/** Function to get all tags specified by journal
 *
 * @param {*} user Specified user
 * @param {*} journalId Specified journal to grab tags from
* */
async function getAllTags(user, journalId) {
  return new Promise((resolve) => {
    const blogs = [];
    database.ref().child(`users/${user}/journals/${journalId}/tags`).get()
      .then((snapshot) => {
        resolve(snapshot.val());
      });
  });
}

/** Function to get all journals from a user asynchronously
 *
 * @param {*} user Specified user
* */
async function getAllJournalsAsync(user) {
  const blogs = [];
  let journals = '';
  return new Promise((resolve) => {
    database.ref().child(`users/${user}/journals/`).get()
      .then((snapshot) => {
        journals = snapshot.val();
        resolve(journals);
      });
  });
}

/** Function to get a specific journal from a specific user
 *
 * @param {*} user Specified user
 * @param {*} journalId Specified journal to grab
* */
async function getJournal(user, journal) {
  return new Promise((resolve) => {
    database.ref().child(`users/${user}/journals/${journal}`).get()
      .then((snapshot) => {
        journal = snapshot.val();
        resolve(journal);
      });
  });
}

/**
 * Inserts all tags into the specified journal attached to the specified user
 *
 * @param {string} user user id to add journal tags for
 * @param {string} journalId The name of the journal to add tags for
 * @param {Array} journalTags list of tags to add
 */
function insertTagsMany(user, journalId, journalTags) {
  const tags = database.ref().child(`users/${user}/journals/${journalId}/tags/`);
  journalTags.forEach((tag) => {
    newTag(user, journalId, tag);
  });
}

// Export functions
export {
  createNewUser, getNewJournalId, createNewJournal,
  deleteJournal, editJournal, newTag, deleteTag,
  getNewTodoId, createNewEntry, deleteTodo, editTodo,
  getAllJournals, getEntries, getAllEntries, getAllJournalsAsync,
  getAllTags, getJournal, insertTagsMany,
};
