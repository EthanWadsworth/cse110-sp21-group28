/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const database = firebase.database();

// Create a new user
function createNewUser(user, password) {
  console.log('creating new user');
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
    Parameters: journalName: name of the jouranl
                journalDesc: journal description
                user: user
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
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
    Parameters: journal_id: id of the journal for reference in backend
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function deleteJournal(user, journalId) {
  console.log(`Deleting journal ${journalId}`);
  database.ref(`users/${user}/journals/${journalId}`).remove();
}

/*  Function to edit a journal (name/description)
    Parameters: journal_id: id of the journal for reference in backend
                spec: specifies if name or description is being changed
                  Should be "color" or "tags" o "entries"
                specChange: what the spec should be changed to

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function editJournal(user, journalId, spec, specChange) {
  console.log(`Editing journal ${journalId}'s ${spec}`);
  database.ref(`users/${user}/journals/${journalId}`).update({ [spec]: specChange });
}

/*  Function to insert new tag into the journal
    Parameters: journal_id: id of the journal for reference for which post id we're making
                user: user
                tag: tag to be inserted into tag array for this journal

                NOTE: need to add the callback functionality after making renderJournals
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
        console.log('Tag already exists in this journal!');
      }
    });
}

/*  Function to delete tag from the journal
    Parameters: journal_id: id of the journal for reference for which post id we're making
                user: user
                tag: tag to be deleted from the journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function deleteTag(user, journalId, tag) {
  const tags = database.ref().child(`users/${user}/journals/${journalId}/tags/`);
  database.ref().child(`users/${user}/journals/${journalId}/tags`).get()
    .then((snapshot) => {
      snapshot.forEach((tagSnap) => {
        const { key } = tagSnap;
        const val = tagSnap.val();
        if (val === tag) {
          // console.log('found match');
          tags.child(`${key}`).remove();
        }
      });
    });
}

/*  Function to get new Post Id for insertion into a journal
    Parameters: journal_id: id of the journal for reference for which post id we're making
                user: user

                NOTE: need to add the callback functionality after making renderJournals
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
    Parameters: journal_id: id of the journal for reference in backend
                todo_id: id of the todo for deletion
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function deleteTodo(user, journalId, entryId) {
  // console.log(`Deleting todo ${todoId} from journal ${journalId}`);
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).remove();
}

/*  Function to edit a todo
    Parameters: journalId: id of the journal for reference in backend
                todoId: id of the todo to edit
                specChange: dict of pre instance values to the new values (DONT EDIT TAGS)

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function editTodo(user, journalId, entryId, specChange, spec) {
  database.ref(`users/${user}/journals/${journalId}/entries/${entryId}`).update(specChange);
}

/*  Function to get all journal objects
    Parameters: user: userId

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function getAllJournals(user) {
  const blogs = [];
  const journals = database.ref().child(`users/${user}/journals/`).get()
    .then((snapshot) => {
      const journal = snapshot.val();
      return journal;
    });
}
/*  Function to get all Todos specified by journal and user
    Parameters: journalId: id of the journal for reference in backend

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
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

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function getAllEntries(user) {
  const blogs = [];
  const journals = database.ref().child(`users/${user}/journals/`).get()
    .then((snapshot) => {
      const journal = snapshot.val();
      Object.keys(journal).forEach((journId) => {
        getEntries(user, journId)
          .then((entries) => {
            blogs.push(entries);
          });
      });
    });
  // console.log(blogs)
  return blogs;
}

// TESTING AND USE CASES BELOW
// getNewPostId(4);

// getTodos(0);
// let newspec = {description: "woopsie daisey", end_date: "Date 200", title: "Lab 7"}
// editTodo(2, 0, newspec

// let hi = getNewTodoId(0)
// hi.then((result) => {
//   console.log(result);
// })

// editJournal(2,"journalDesc","Bruhhhhhhh this works" );
// deleteTodo(0, 2);

// const testname = "Weird proof of concept"
// const desc = "wait what lol"
// const journalId = 0
// const todotags = ['NOTHW', 'HW']
// const start = "Date 1"
// const end = "Date 2"

// createNewToDo(testname, desc, start, end, todotags, journalId);

// let newtest = "CSE 110"
// let newdesc = "lol this class really is something"
// createNewJournal(newtest, newdesc);
