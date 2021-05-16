/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-unused-vars */
/* eslint-disable padded-blocks */
/* eslint-disable no-undef */
// eslint-disable-next-line no-trailing-spaces

const database = firebase.database();

// DAVE TO DO:
// Write the getJournals function (this is important for the render function)
// Find a way to populate HTML page with all of those journals
// Make the render function for JOurnals


// Function to get new JournalId when inserting a new journal
function getNewJournalId() {
  return database.ref().child('journalId').get()
    .then((snapshot) => {
      firebase.database().ref('journalId').set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}

/*  Function to create a new Journal
    Parameters: journalName: name of the jouranl
                journalDesc: journal description
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function createNewJournal(journalName, journalDesc) {
  const newJournId = getNewJournalId();
  newJournId.then((result) => {
    firebase.database().ref(`journals/${result}`).set({
      journalTitle: journalName,
      journalDescription: journalDesc,
      id: result,
      postId: 0,
    });
  });
}
/*  Function to delete a Journal
    Parameters: journal_id: id of the journal for reference in backend
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function deleteJournal(journalId) {
  console.log(`Deleting journal ${journalId}`);
  database.ref(`journals/${journalId}`).remove();
}

/*  Function to edit a journal (name/description)
    Parameters: journal_id: id of the journal for reference in backend
                spec: specifies if name or description is being changed
                  Should be "journalDesc" or "journalTitle"
                specChange: what the spec should be changed to

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function editJournal(journalId, spec, specChange) {
  console.log(`Editing journal ${journalId}'s ${spec}`);
  database.ref(`journals/${journalId}`).update({ [spec]: specChange });
}

/*  Function to get new Post Id for insertion into a journal
    Parameters: journal_id: id of the journal for reference for which post id we're making

                NOTE: need to add the callback functionality after making renderJournals
*/
function getNewTodoId(journalId) {
  return database.ref().child(`journals/${journalId}`).child('postId').get()
    .then((snapshot) => {
      firebase.database().ref(`journals/${journalId}/postId`).set(snapshot.val() + 1);
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
function createNewToDo(todoName, todoDesc, start, end, todotags, journalId) {
  const newTodoId = getNewTodoId(journalId);
  newTodoId.then((result) => {
    firebase.database().ref(`journals/${journalId}/todos/${result}`).set({
      id: result,
      title: todoName,
      description: todoDesc,
      start_date: start,
      end_date: end,
      tags: todotags,
    });
  });
}

/*  Function to delete a todo
    Parameters: journal_id: id of the journal for reference in backend
                todo_id: id of the todo for deletion
                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function deleteTodo(journalId, todoId) {
  // console.log(`Deleting todo ${todoId} from journal ${journalId}`);
  database.ref(`journals/${journalId}/todos/${todoId}`).remove();
}

/*  Function to edit a todo
    Parameters: journalId: id of the journal for reference in backend
                todoId: id of the todo to edit
                specChange: dictionary of post instance values to the new values

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function editTodo(journalId, todoId, specChange) {
  database.ref(`journals/${journalId}/todos/${todoId}`).update(specChange);
}

/*  Function to get all Todos
    Parameters: journalId: id of the journal for reference in backend

                callback: function to re-render views of journal

                NOTE: need to add the callback functionality after making renderJournals
*/
function getTodos(journalId) {
  let blogs = [];
  return database.ref().child(`journals/${journalId}/todos`).get()
    .then((snapshot) => {
      blogs = snapshot.val();
    })
    .then(() => blogs)
    .then(() => {
      console.log(blogs);
    });
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
