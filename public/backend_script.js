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

// Function to get new JournalId when inserting a new journal
function getNewJournalId(user) {
  return database.ref().child(`users/${user}/journalId`).get()
    .then((snapshot) => {
      firebase.database().ref(`users/${user}/journalId`).set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}

/*  Function to create a new Journal
    Parameters: journalName: name of the journal
                journalDesc: journal description
                user: user
*/
function createNewJournal(user, journalName, journalDesc) {
  // const newJournId = getNewJournalId();
  // newJournId.then((result) => {
  //   firebase.database().ref(`${user}/journals/${result}`).set({
  //     journalTitle: journalName,
  //     journalDescription: journalDesc,
  //     id: result,
  //     postId: 0,
  //   });
  // });
  firebase.database().ref(`users/${user}/journals/${journalName}`).set({
    journalDescription: journalDesc,
    color: '#FFFFFF',
  });
}

/*  Function to delete a Journal
    Parameters: journal_id: name of the journal for reference in backend
                user: user

*/
function deleteJournal(user, journalId) {
  database.ref(`users/${user}/journals/${journalId}`).remove();
}

/*  Function to edit a journal (name/description)
    Parameters: journal_id: name of the journal for reference in backend
                spec: specifies if name or description is being changed
                  Should be "color" or "tags" or "entries"
                specChange: what the spec should be changed to
                  Should be (string for color and tag, list of strings for entry)
*/
function editJournal(user, journalId, spec, specChange) {
  // console.log(`Editing journal ${journalId}'s ${spec}`);
  database.ref(`users/${user}/journals/${journalId}`).update({ [spec]: specChange });
}

/*  Function to insert new tag into the journal
    Parameters: journal_id: id of the journal for reference for which post id we're making
                user: user
                tag: tag to be inserted into tag array for this journal
*/
function newTag(user, journalId, tag) {
  const tags = database.ref().child(`users/${user}/journals/${journalId}/tags/`);
  let seen = false;
  database.ref().child(`users/${user}/journals/${journalId}/tags`).get()
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
      } else {
        console.error('Tag already exists in this journal!');
      }
    });
}

/*  Function to delete tag from the journal
    Parameters: journal_id: name of the journal for reference for which post id we're making
                user: user
                tag: tag to be deleted from the journal
*/
function deleteTag(user, journalId, tag) {
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

/*  Function to get new Post Id for insertion into a journal
    Parameters: journal_id: name of the journal for reference for which post id we're making
                user: user
*/
function getNewTodoId(user, journalId) {
  return database.ref().child(`users/${user}/journals/${journalId}`).child('postId').get()
    .then((snapshot) => {
      firebase.database().ref(`users/${user}/journals/${journalId}/postId`).set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}

/*  Function to create a new todo
    Parameters: todoName: name of the post
                todoDesc: journal description
                start: todo start
                end: todo end
                tags: list of tags
                journalId: journal the new todo belongs to
                callback: function to re-render views of todos

                NOTE: need to add the callback functionality after making renderTodos
*/
function createNewEntry(user, todoName, todoDesc, start, end, todotags, journalId) {
  // const newTodoId = getNewTodoId(journalId);
  // newTodoId.then((result) => {
  //   firebase.database().ref(`users/${user}/journals/${journalId}/entries/${result}`).set({
  //     id: result,
  //     title: todoName,
  //     description: todoDesc,
  //     start_date: start,
  //     end_date: end,
  //     tags: todotags,
  //     isDone: false
  //   });
  // });
  const todoId = todoName.replace(/\s+/g, '').toLowerCase();
  firebase.database().ref(`users/${user}/journals/${journalId}/entries/${todoId}`).set({
    title: todoName,
    description: todoDesc,
    start_date: start,
    end_date: end,
    tags: todotags,
    isDone: false,
  });
  todotags.forEach((tag) => {
    newTag(user, journalId, tag);
  });
}

/*  Function to delete a todo
    Parameters: journal_id: name of the journal for reference in backend
                todo_id: id of the todo for deletion
*/
function deleteTodo(user, journalId, entryId) {
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).remove();
}

/*  Function to edit a todo
    Parameters: journalId: name of the journal for reference in backend
                todoId: id of the todo to edit
                specChange: dict of pre instance values to the new values
                  (DONT EDIT TAGS AS TAG EDITING HAS ITS OWN PROPERTY)
*/
function editTodo(user, journalId, entryId, specChange, spec) {
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).update(specChange);
}

/*  Function to get all journal objects of a user
    Parameters: user: userId

    Returns a list of journal objects
*/
function getAllJournals(user) {
  const blogs = [];
  const journals = database.ref().child(`users/${user}/journals/`).get()
    .then((snapshot) => {
      const journal = snapshot.val();
      return journal;
    });
}
/*  Function to get all entries specified by journal and user
    Parameters: journalId: id of the journal for reference in backend

    Returns a list of entry objects
*/
function getEntries(user, journalId) {
  let blogs = [];
  return database.ref().child(`users/${user}/journals/${journalId}/entries`).get()
    .then((snapshot) => {
      blogs = snapshot.val();
    })
    .then(() => blogs);
}
/*  Function to get all Todos of a user REGARDLESS of journal
    Parameters: journalId: id of the journal for reference in backend

    Returns a list of entry objects
*/
async function getAllEntries(user) {
  return new Promise((resolve) => {
    const blogs = [];
    database.ref().child(`users/${user}/journals/`).on('value', (snapshot) => {
      Object.keys(snapshot.val()).forEach((journId) => {
        getEntries(user, journId)
          .then((entries) => {
            for (const [key, value] of Object.entries(entries)) {
              blogs.push({ [key]: value });
            }
          })
          .then(() => {
            resolve(blogs);
          });
      });
    });
  });

  //   .then((snapshot) => {
  //     const journal = snapshot.val();
  //     Object.keys(journal).forEach((journId) => {
  //       getEntries(user, journId)
  //         .then((entries) => {
  //           for (const [key, value] of Object.entries(entries)) {
  //             blogs.push({ [key]: value });
  //           }
  //         });
  //     });
  //   });
  // return blogs;
}
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

function getAllTags(user, journalId) {
  let blogs = [];
  return database.ref().child(`users/${user}/journals/${journalId}/tags`).get()
    .then((snapshot) => {
      blogs = snapshot.val();
    })
    .then(() => blogs);
}

// function getAllEntries(user) {
//   const blogs = [];
//   const journals = database.ref().child(`users/${user}/journals/`).get()
//     .then((snapshot) => {
//       const journal = snapshot.val();
//       Object.keys(journal).forEach((journId) => {
//         getEntries(user, journId)
//           .then((entries) => {
//             for (const [key, value] of Object.entries(entries)) {
//               blogs.push({ [key]: value });
//             }
//           });
//       });
//     });
//   return blogs;
// }

// Export functions
export {
  createNewUser, getNewJournalId, createNewJournal,
  deleteJournal, editJournal, newTag, deleteTag,
  getNewTodoId, createNewEntry, deleteTodo, editTodo,
  getAllJournals, getEntries, getAllEntries, getAllJournalsAsync,
  getAllTags,
};
