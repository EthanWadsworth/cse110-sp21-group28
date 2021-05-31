/**
 * Changes the weekly date range by using a Date object
 * EXECUTES WHEN CLICKING ON BUTTON TO CHANGE WEEK RANGE
 * @param {*} firstMonth
 * @param {*} firstDate
 * @param {*} firstYear
 * @param {*} secondMonth
 * @param {*} secondDate
 * @param {*} secondYear
 * @param {*} direction
 */
function findNextWeeklyDates(firstMonth, firstDate, firstYear, secondMonth, secondDate,
  secondYear, direction) {
  const dateRange = document.querySelector('.dateRange');
  let newFirstDate;
  let newSecondDate;
  if (direction === 'forward') {
    const nextDate = new Date();
    nextDate.setDate(secondDate);
    nextDate.setMonth(secondMonth - 1);
    nextDate.setFullYear(secondYear);
    nextDate.setDate(nextDate.getDate() + 1);
    newFirstDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear()}`;
    nextDate.setDate(nextDate.getDate() + 6);
    newSecondDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear()}`;
    dateRange.innerHTML = `${newFirstDate} - ${newSecondDate}`;
  } else {
    const nextDate = new Date();
    nextDate.setDate(firstDate);
    nextDate.setMonth(firstMonth - 1);
    nextDate.setFullYear(firstYear);
    nextDate.setDate(nextDate.getDate() - 1);
    newSecondDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear()}`;
    nextDate.setDate(nextDate.getDate() - 6);
    newFirstDate = `${nextDate.getMonth() + 1}/${nextDate.getDate()}/${nextDate.getFullYear()}`;
    dateRange.innerHTML = `${newFirstDate} - ${newSecondDate}`;
  }
}

/** Changes the dates next to Sunday, Monday, Tuesday, etc.,
 * to match the current weekly range's dates
 * EXECUTES WHENEVER WEEKLY DATE RANGE CHANGES
 */
function changeDatesOfTheWeek() {
  const weekRange = document.querySelector('.dateRange');
  const dates = weekRange.innerHTML;
  const currentDate = new Date();
  const splitDates = dates.split(' - ');
  const firstDate = splitDates[0].split('/');

  currentDate.setFullYear(Number(firstDate[2]));
  currentDate.setDate(Number(firstDate[1]));
  currentDate.setMonth(Number(firstDate[0]) - 1);
  const day = document.querySelectorAll('div > h3 > span');
  for (let i = 0; i < 7; i += 1) {
    day[i].innerHTML = `${currentDate.getMonth() + 1}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  /* TODO: CHANGE THE TAGS/TASKS INVOLVED BASED ON INFO FROM DATABASE */
}

/** FUNCTION TODO: CHANGE TAGS/TASKS INVOLVED FOR EACH DAY OF WEEK BASED ON INFO FROM DATABASE */

/** FUNCTION TODO: WHEN CHANGING DAY, SHOW ALL OF THAT DAY'S TASKS ON THE RIGHT SIDE
 *  IN OTHER WORDS, GET FROM DATABASE AND USE DOM ELEMENTS TO SHOW ALL TASKS.
*/

/** FUNCTION TODO: WHEN ADDING TASK, PUT THE INFO INTO DATABASE */

/**  Changes the Weekly Date Range if necessary when reloading the page (and it's a different week)
 *   If changing the date range is necessary, then change the dates next to each day of the week
 *   EXECUTES ONLY WHEN WINDOW RELOADS
 */
function changeWeeklyDates() {
  const today = new Date();
  const dayOfTheWeek = today.getDay();
  const dateRange = document.querySelector('.dateRange');
  let saturdayDate;
  const nextDay = new Date(today);
  for (let i = dayOfTheWeek; i < 7; i += 1) {
    if (i === 6) {
      saturdayDate = `${nextDay.getMonth() + 1}/${nextDay.getDate()}/${nextDay.getFullYear()}`;
    } else {
      nextDay.setDate(nextDay.getDate() + 1);
    }
  }
  const prevDay = new Date(today);
  let sundayDate;
  for (let i = dayOfTheWeek; i >= 0; i -= 1) {
    if (i === 0) {
      sundayDate = `${prevDay.getMonth() + 1}/${prevDay.getDate()}/${prevDay.getFullYear()}`;
    } else {
      prevDay.setDate(prevDay.getDate() - 1);
    }
  }
  dateRange.innerHTML = `${sundayDate} - ${saturdayDate}`;
}

/** Changes the Daily Todo Tasks and Date
 * Also checks to see if the weekly date range needs to be changed
 */
function changeDailyTodo() {
  const shownDate = document.querySelector('body > div > div.daily > div.dateRange');
  const today = new Date();
  const date = String(today.getDate());
  const shownDay = shownDate.innerHTML.split('/');
  if (shownDay[1] !== date) {
    const month = String(today.getMonth() + 1);
    const year = today.getFullYear();
    shownDate.innerHTML = `${month}/${date}/${year}`;
    /* TODO: IMPLEMENT SOME FUNCTIONALITY TO SHOW THAT DAY'S TASKS UNDER DAILY */
    changeWeeklyDates();
    changeDatesOfTheWeek();
  }
}
/**
 * When the page loads, check to make sure that the day has been updated and is correctly showing
 */
window.onload = changeDailyTodo();
/**
 * This event listener will move the week range forward by 7 days
 */
const weekButton = document.querySelectorAll('div > input');
weekButton[1].addEventListener('click', () => {
  const dateRange = document.querySelector('.dateRange');
  const dates = dateRange.innerHTML;
  const splitDates = dates.split(' - ');
  const firstDate = splitDates[0].split('/');
  const secondDate = splitDates[1].split('/');
  // const dateContainer = document.querySelector('.dateContainer');
  findNextWeeklyDates(Number(firstDate[0]), Number(firstDate[1]),
    Number(firstDate[2]), Number(secondDate[0]), Number(secondDate[1]), Number(secondDate[2]), 'forward');
  changeDatesOfTheWeek();
});
/**
 * This event listener will move the week range back by 7 days
 */
weekButton[0].addEventListener('click', () => {
  const dateRange = document.querySelector('.dateRange');
  const dates = dateRange.innerHTML;
  const splitDates = dates.split(' - ');
  const firstDate = splitDates[0].split('/');
  const secondDate = splitDates[1].split('/');
  // const dateContainer = document.querySelector('.dateContainer');
  findNextWeeklyDates(Number(firstDate[0]), Number(firstDate[1]),
    Number(firstDate[2]), Number(secondDate[0]), Number(secondDate[1]), Number(secondDate[2]), 'backward');
  changeDatesOfTheWeek();
});

// ALL OF THE BUTTON IMPLEMENTATIONS FOR THE SIDEBAR
const logout = document.querySelector('body > div > div.sidebar > a:nth-child(4)');
logout.addEventListener('click', () => {
  window.location = '../../public/index.html';
});
const journalsPage = document.querySelector('body > div > div.sidebar > a:nth-child(2)');
journalsPage.addEventListener('click', () => {
  window.location = '../My-Journals/my-journals.html';
});
const newTaskButton = document.querySelector('body > div > div.sidebar > a:nth-child(3)');
newTaskButton.addEventListener('click', () => {
  const wrapper = document.querySelector('.wrapper');
  const dailyPage = document.querySelector('body > div > div.daily');
  dailyPage.style.display = 'none';

  const addTask = document.createElement('div');
  addTask.setAttribute('class', 'addTask');
  wrapper.appendChild(addTask);

  const header = document.createElement('h1');
  header.innerHTML = 'Task';
  addTask.appendChild(header);

  const inputInfo = document.createElement('div');
  inputInfo.setAttribute('class', 'inputInfo');
  inputInfo.innerHTML = 'Fill in the Boxes';
  addTask.appendChild(inputInfo);

  //--------------------------------------------------------------
  const taskEditor = document.createElement('div');
  taskEditor.setAttribute('class', 'taskEditor');
  addTask.appendChild(taskEditor);

  const taskForm = document.createElement('form');
  taskForm.setAttribute('class', 'taskEditorForm');
  taskEditor.appendChild(taskForm);

  const editNamesAndTags = document.createElement('div');
  editNamesAndTags.setAttribute('class', 'editNamesAndTags');
  taskForm.appendChild(editNamesAndTags);

  const editName = document.createElement('div');
  editName.setAttribute('class', 'editName');
  editNamesAndTags.appendChild(editName);

  const editTaskName = document.createElement('label');
  editTaskName.setAttribute('for', 'editTaskName');
  editName.appendChild(editTaskName);
  const nameOfEditTask = document.createElement('h3');
  nameOfEditTask.innerHTML = 'Edit name';
  editTaskName.appendChild(nameOfEditTask);

  const inputTaskName = document.createElement('input');
  inputTaskName.setAttribute('type', 'text');
  inputTaskName.setAttribute('id', 'editTaskName');
  inputTaskName.setAttribute('name', 'editTaskName');
  inputTaskName.setAttribute('value', '');

  editName.appendChild(inputTaskName);

  const editTags = document.createElement('div');
  editTags.setAttribute('class', 'editTags');
  editNamesAndTags.appendChild(editTags);
  const displayTagName = document.createElement('h3');
  displayTagName.innerHTML = 'Select Tags';
  editTags.appendChild(displayTagName);
  const tagSelector = document.createElement('select');
  tagSelector.setAttribute('id', 'tagSelector');
  tagSelector.setAttribute('multiple', 'true');
  editTags.appendChild(tagSelector);
  const instructionsForTags = document.createElement('option');
  instructionsForTags.setAttribute('value', '0');
  instructionsForTags.innerHTML = 'Hold Ctrl/Command for multiple';
  tagSelector.appendChild(instructionsForTags);

  const editDate = document.createElement('div');
  editDate.setAttribute('class', 'editDate');
  taskForm.appendChild(editDate);
  const editTaskStart = document.createElement('label');
  editTaskStart.setAttribute('for', 'editTaskStart');
  editDate.appendChild(editTaskStart);
  const nameOfEditDate = document.createElement('h3');
  nameOfEditDate.innerHTML = 'Edit Date';
  editTaskStart.appendChild(nameOfEditDate);

  const infoForTaskStart = document.createElement('input');
  infoForTaskStart.setAttribute('type', 'date');
  infoForTaskStart.setAttribute('id', 'editTaskStart');
  infoForTaskStart.setAttribute('name', 'editTaskStart');
  infoForTaskStart.setAttribute('value', '');
  editDate.appendChild(infoForTaskStart);
  const filler = document.createElement('h3');
  filler.innerHTML = 'to';
  editDate.appendChild(filler);
  const infoForTaskEnd = document.createElement('input');
  infoForTaskEnd.setAttribute('type', 'date');
  infoForTaskEnd.setAttribute('id', 'editTaskEnd');
  infoForTaskEnd.setAttribute('name', 'editTaskEnd');
  infoForTaskEnd.setAttribute('value', '');
  editDate.appendChild(infoForTaskEnd);

  const editDescription = document.createElement('div');
  editDescription.setAttribute('class', 'editDescription');
  taskForm.appendChild(editDescription);
  const editTaskDescription = document.createElement('label');
  editTaskDescription.setAttribute('for', 'editTaskDescription');
  editDescription.appendChild(editTaskDescription);
  const nameOfEditDescription = document.createElement('h3');
  nameOfEditDescription.innerHTML = 'Edit Description';
  editTaskDescription.appendChild(nameOfEditDescription);

  const textAreaForInfo = document.createElement('textarea');
  textAreaForInfo.setAttribute('id', 'editTaskDescription');
  textAreaForInfo.setAttribute('name', 'editTaskDescription');

  editDescription.appendChild(textAreaForInfo);

  const submitButton = document.createElement('input');
  submitButton.setAttribute('type', 'submit');
  submitButton.setAttribute('value', 'Submit');
  taskForm.appendChild(submitButton);

  submitButton.addEventListener('click', () => {
    /** INPUT THINGS INTO DATABASE */

    /* currentTaskName.innerHTML = inputTaskName.value;

    currentTaskDates.innerHTML = infoForTaskStart.value + " - " + infoForTaskEnd.value;

    const newText = textAreaForInfo.value.split("\n");
    const newTaskDescription = item.querySelector('.taskDescription');
    for(var i = 0; i<newText.length; i+= 1){
      console.log(newText[i]);
      let newList = document.createElement('li');
      newList.innerHTML = newText[i];
      newTaskDescription.appendChild(newList);
    }
    */
    /** STORE IN DATABASE AND ADD THIS TASK FOR EVERY DAY BASED ON currentTaskDates */
    wrapper.removeChild(addTask);
    dailyPage.style.display = 'block';
    changeDailyTodo();
    changeWeeklyDates();
    changeDatesOfTheWeek();
  });
});

/** EVENTLISTENERS for button(Sunday, Monday, Tuesday, etc.) */
const days = document.querySelectorAll('.day');
const shownDate = document.querySelector('body > div > div.daily > div.dateRange');

days.forEach((day) => {
  day.addEventListener('click', () => {
    shownDate.innerHTML = day.querySelector('.date').innerHTML;
    /** show entries for this day on the right side (get from database and create dom elements) */
  });
});

/** Double click on a task to edit (edit screen shows up)
 *  Once user presses submit, database should update existing info with what was just inputted
 */
const tasks = document.querySelectorAll('.taskContainer');
let currentItem;
tasks.forEach((item) => {
  item.addEventListener('dblclick', () => {
    currentItem = item;
    const currentTaskName = item.querySelector('.taskName');
    const currentTaskDescription = item.querySelectorAll('.taskDescription > li');
    let convertedList = '';
    for (let j = 0; j < currentTaskDescription.length; j += 1) {
      convertedList += `${currentTaskDescription[j].innerHTML}\n`;
    }
    const currentTaskDates = item.querySelector('#daily');
    const currentDates = currentTaskDates.innerHTML.split(' - ');
    const currentTaskFirstDate = currentDates[0];
    const currentTaskSecondDate = currentDates[1];

    const daily = document.querySelector('.daily');
    const taskEditor = document.createElement('div');
    taskEditor.setAttribute('class', 'taskEditor');
    daily.appendChild(taskEditor);
    // daily.insertAfter(taskEditor, daily.item);
    currentItem.style.display = 'none';
    const taskForm = document.createElement('form');
    taskForm.setAttribute('class', 'taskEditorForm');
    taskEditor.appendChild(taskForm);

    const editNamesAndTags = document.createElement('div');
    editNamesAndTags.setAttribute('class', 'editNamesAndTags');
    taskForm.appendChild(editNamesAndTags);

    const editName = document.createElement('div');
    editName.setAttribute('class', 'editName');
    editNamesAndTags.appendChild(editName);

    const editTaskName = document.createElement('label');
    editTaskName.setAttribute('for', 'editTaskName');
    editName.appendChild(editTaskName);
    const nameOfEditTask = document.createElement('h3');
    nameOfEditTask.innerHTML = 'Edit name';
    editTaskName.appendChild(nameOfEditTask);

    const inputTaskName = document.createElement('input');
    inputTaskName.setAttribute('type', 'text');
    inputTaskName.setAttribute('id', 'editTaskName');
    inputTaskName.setAttribute('name', 'editTaskName');
    inputTaskName.setAttribute('value', '');
    inputTaskName.value = currentTaskName.innerHTML;

    editName.appendChild(inputTaskName);

    const editTags = document.createElement('div');
    editTags.setAttribute('class', 'editTags');
    editNamesAndTags.appendChild(editTags);
    const displayTagName = document.createElement('h3');
    displayTagName.innerHTML = 'Select Tags';
    editTags.appendChild(displayTagName);
    const tagSelector = document.createElement('select');
    tagSelector.setAttribute('id', 'tagSelector');
    tagSelector.setAttribute('multiple', 'true');
    editTags.appendChild(tagSelector);
    const instructionsForTags = document.createElement('option');
    instructionsForTags.setAttribute('value', '0');
    instructionsForTags.innerHTML = 'Hold Ctrl/Command for multiple';
    tagSelector.appendChild(instructionsForTags);

    const editDate = document.createElement('div');
    editDate.setAttribute('class', 'editDate');
    taskForm.appendChild(editDate);
    const editTaskStart = document.createElement('label');
    editTaskStart.setAttribute('for', 'editTaskStart');
    editDate.appendChild(editTaskStart);
    const nameOfEditDate = document.createElement('h3');
    nameOfEditDate.innerHTML = 'Edit Date';
    editTaskStart.appendChild(nameOfEditDate);

    const infoForTaskStart = document.createElement('input');
    infoForTaskStart.setAttribute('type', 'date');
    infoForTaskStart.setAttribute('id', 'editTaskStart');
    infoForTaskStart.setAttribute('name', 'editTaskStart');
    infoForTaskStart.setAttribute('value', '');
    infoForTaskStart.value = currentTaskFirstDate;
    editDate.appendChild(infoForTaskStart);
    const filler = document.createElement('h3');
    filler.innerHTML = 'to';
    editDate.appendChild(filler);
    const infoForTaskEnd = document.createElement('input');
    infoForTaskEnd.setAttribute('type', 'date');
    infoForTaskEnd.setAttribute('id', 'editTaskEnd');
    infoForTaskEnd.setAttribute('name', 'editTaskEnd');
    infoForTaskEnd.setAttribute('value', '');
    infoForTaskEnd.value = currentTaskSecondDate;
    editDate.appendChild(infoForTaskEnd);

    const editDescription = document.createElement('div');
    editDescription.setAttribute('class', 'editDescription');
    taskForm.appendChild(editDescription);
    const editTaskDescription = document.createElement('label');
    editTaskDescription.setAttribute('for', 'editTaskDescription');
    editDescription.appendChild(editTaskDescription);
    const nameOfEditDescription = document.createElement('h3');
    nameOfEditDescription.innerHTML = 'Edit Description';
    editTaskDescription.appendChild(nameOfEditDescription);

    const textAreaForInfo = document.createElement('textarea');
    textAreaForInfo.setAttribute('id', 'editTaskDescription');
    textAreaForInfo.setAttribute('name', 'editTaskDescription');
    textAreaForInfo.innerHTML = convertedList;

    editDescription.appendChild(textAreaForInfo);

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'Submit');
    taskForm.appendChild(submitButton);

    submitButton.addEventListener('click', () => {
      currentItem.style.display = 'flex';
      currentTaskName.innerHTML = inputTaskName.value;
      console.log(`${infoForTaskStart.value} - ${infoForTaskEnd.value}`);
      currentTaskDates.innerHTML = `${infoForTaskStart.value} - ${infoForTaskEnd.value}`;

      console.log(textAreaForInfo.value);
      const newText = textAreaForInfo.value.split('\n');
      const newTaskDescription = item.querySelector('.taskDescription');
      let i;
      for (i = 0; i < currentTaskDescription.length; i += 1) {
        newTaskDescription.removeChild(currentTaskDescription[i]);
      }
      let j;
      for (j = 0; j < newText.length; j += 1) {
        if (newText[j] !== '') {
          const newList = document.createElement('li');
          newList.innerHTML = newText[j];
          newTaskDescription.appendChild(newList);
        }
      }
      /** STORE IN DATABASE AND ADD THIS TASK FOR EVERY DAY BASED ON currentTaskDates */
      daily.removeChild(taskEditor);
    });
  });
});

tasks.forEach((item) => {
  item.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    alert('DO YOU WANT TO DELETE THIS TASK? DELETION CANNOT BE UNDONE');
    /** UPDATES TASKS ASSIGNED TO THOSE DAYS BY SUBTRACTING BY 1 */
    item.parentNode.removeChild(item);
  });
});
