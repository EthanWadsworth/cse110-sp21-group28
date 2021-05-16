function getNewJournalId() {
  return database.ref().child('journalId').get()
    .then((snapshot) => {
      firebase.database().ref('journalId').set(snapshot.val() + 1);
      countId = snapshot.val();
    })
    .then(() => countId);
}
console.log(getNewJournalId());
