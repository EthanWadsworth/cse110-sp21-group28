import {
  createNewEntry, deleteTodo, editTodo,
  getEntries, getAllEntries, getAllJournalsAsync, getAllTags,
} from '../backend/backend_script.js?3';

/**
 * Gets NAMES of journals that have tasks at CURRENT date (for Weekly Panel "Tags")
 * @param {*} currentDate
 */
async function getCurrentJournals(currentDate) {
  const currJournals = [];
  const journals = await getAllJournalsAsync('User1');
  if (journals) {
    const names = Object.keys(journals);
    names.forEach((name) => {
      const { entries } = journals[name];
      if (entries) {
        const obj = Object.keys(entries);
        obj.forEach((entry) => {
          const startDate = new Date(entries[entry].start_date);
          const endDate = new Date(entries[entry].end_date);
          const currDate = new Date(currentDate);
          if (startDate <= currDate && currDate <= endDate) {
            currJournals.push([name, journals[name].color]);
          }
        });
      }
    });
  }
  return currJournals;
}

/**
 * Gets all the entries that are still active at CURRENT date (for Daily Panel)
 * @param {*} currentDate
 */
async function getCurrentEvents(currentDate) {
  const rangedEntries = [];
  return new Promise((resolve) => {
    getAllEntries('User1').then((entries) => {
      entries.forEach((entry) => {
        const obj = Object.keys(entry);
        const startDate = new Date(entry[obj].start_date);
        const endDate = new Date(entry[obj].end_date);
        const currDate = new Date(currentDate);
        if (startDate <= currDate && currDate <= endDate) rangedEntries.push(entry[obj]);
      });
    }).then(() => resolve(rangedEntries));
  });
}

/**
 * Gets NUMBER of active tasks at CURRENT date
 * @param {*} currentDate
 *
 */
async function getNumTasks(currentDate) {
  return new Promise((resolve) => {
    getCurrentEvents(currentDate).then((result) => resolve(result.length));
  });
}

/**
 * Populates the journal name tags on the WEEKLY panel for each day of the week
 * EXECUTES ON PAGE RELOAD AND REFRESH
 */
async function populateWeeklyTags() {
  const weekRange = document.querySelector('.dateRange');
  const dates = weekRange.innerHTML;
  const splitDates = dates.split(' - ');
  const firstDate = new Date(splitDates[0].split('/'));
  const currDate = firstDate;
  for (let i = 0; i < 7; i += 1) {
    const tempDate = currDate.getDate();
    let tempMonth = currDate.getMonth();
    tempMonth += 1;
    const tempYear = currDate.getFullYear();
    const currJournals = await getCurrentJournals(`${tempMonth}/${tempDate}/${tempYear}`);

    getNumTasks(`${tempMonth}/${tempDate}/${tempYear}`).then((result) => {
      if (result > 0) {
        const dateContainer = document.querySelectorAll('.day > .tagContainer')[i];
        const dupCheck = new Set();
        currJournals.forEach((journal) => {
          if (!dupCheck.has(journal[0])) {
            const newTag = document.createElement('div');
            newTag.setAttribute('class', 'tag');
            newTag.setAttribute('id', journal[1]);
            newTag.innerHTML = `<text>${journal[0]}</text>`;
            dateContainer.appendChild(newTag);
            dupCheck.add(journal[0]);
          }
        });
      }
      const taskNum = document.querySelectorAll('.day > .topLine > .tasks > span');
      taskNum[i].innerHTML = `${result} `;
    });
    currDate.setDate(currDate.getDate() + 1);
  }
}

/**
 * Populates the task elements in the DAILY panel of the entries page
 * EXECUTES ON PAGE RELOAD AND REFRESH
 */
async function createTaskContainers() {
  const shownDate = document.querySelector('body > div.wrapper > div.daily > div.dateRange');
  const rangedEntries = await getCurrentEvents(shownDate.innerHTML);
  const currJournals = await getCurrentJournals(shownDate.innerHTML);

  let k = 0;
  rangedEntries.forEach((entry) => {
    let i = 0;

    const daily = document.querySelector('.allTaskContainers');
    const taskContainer = document.createElement('div');
    taskContainer.setAttribute('class', 'taskContainer');
    taskContainer.setAttribute('id', `${k}`);
    k += 1;
    daily.appendChild(taskContainer);

    const task = document.createElement('div');
    task.setAttribute('class', 'task');

    taskContainer.appendChild(task);

    const topLine = document.createElement('div');
    topLine.setAttribute('class', 'topLine');
    task.appendChild(topLine);

    const taskName = document.createElement('div');
    taskName.setAttribute('class', 'taskName');
    taskName.innerHTML = entry.title;
    topLine.appendChild(taskName);

    const dateRange = document.createElement('div');
    dateRange.setAttribute('class', 'dateRange');
    dateRange.setAttribute('id', 'daily');
    dateRange.innerHTML = `${entry.start_date} - ${entry.end_date}`;
    topLine.appendChild(dateRange);

    // HOW WE GONNA TAKE IN WHAT WAS INPUTTED FOR TASK DESCRIPTION AND CONVERT IT INTO A LIST
    const taskDescription = document.createElement('div');
    taskDescription.setAttribute('class', 'taskDescription');
    task.appendChild(taskDescription);
    // WILL CHANGE BASED ON JOURNAL's TEAMS RESPONSE
    const string = entry.description;
    const list = string.split('\n');
    const listOfItems = document.createElement('ul');
    listOfItems.setAttribute('id', 'items');
    taskDescription.appendChild(listOfItems);
    let previous;
    list.forEach((element) => {
      if (element !== '' && element !== '\t') {
        if (i === 0 || element[0] !== '\t') {
          const tempList = document.createElement('li');
          tempList.innerHTML = element;
          listOfItems.appendChild(tempList);
          previous = tempList;
        } else {
          const tabSplit = element.split('\t');
          const tempList = document.createElement('ul');
          previous.appendChild(tempList);
          const newList = document.createElement('li');
          newList.innerHTML = tabSplit[tabSplit.length - 1];
          tempList.appendChild(newList);
        }
        i += 1;
      }
    });

    const tagContainer = document.createElement('div');
    tagContainer.setAttribute('class', 'tagContainer');
    taskDescription.appendChild(tagContainer);

    const { tags } = entry;

    const dupCheck = new Set();
    currJournals.forEach((journal) => {
      dupCheck.add(journal[0]);
    });
    const uniqueJournals = [];
    currJournals.forEach((journal) => {
      if (dupCheck.has(journal[0])) {
        uniqueJournals.push(journal);
        dupCheck.delete(journal[0]);
      }
    });

    // COLORS
    uniqueJournals.forEach((journal) => {
      getEntries('User1', journal[0]).then((result) => {
        const obj = Object.keys(result);
        obj.forEach((object) => {
          if (result[object].description === entry.description
            && result[object].title === entry.title) {
            if (tags != null) {
              for (let y = 0; y < tags.length; y += 1) {
                const tag = document.createElement('div');
                tag.setAttribute('class', 'tag');
                tag.setAttribute('id', journal[1]);
                const text = document.createElement('text');
                text.innerHTML = tags[y];
                tag.appendChild(text);
                tagContainer.appendChild(tag);
              }
            }
            if (result[object].isDone) {
              task.setAttribute('id', `${journal[1]}Done`);
            } else {
              task.setAttribute('id', `${journal[1]}NotDone`);
            }
            topLine.setAttribute('id', journal[0]);
          }
        });
      });
    });
  });
}

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
async function findNextWeeklyDates(firstMonth, firstDate, firstYear, secondMonth, secondDate,
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
async function changeDatesOfTheWeek() {
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
}

/**  Changes the Weekly Date Range if necessary when reloading the page (and it's a different week)
 *   If changing the date range is necessary, then change the dates next to each day of the week
 *   EXECUTES ONLY WHEN WINDOW RELOADS
 */
async function changeWeeklyDates() {
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

/**
 * Clears task containers in WEEKLY panel
 */
async function clearTaskContainers() {
  const removeTaskContainers = document.querySelectorAll('.taskContainer');
  removeTaskContainers.forEach((container) => {
    container.parentNode.removeChild(container);
  });
}

/** Changes the Daily Todo Tasks and Date
 * Also checks to see if the weekly date range needs to be changed
 */
async function changeDailyTodo() {
  const shownDate = document.querySelector('body > div > div.daily > div.dateRange');
  const today = new Date();
  const date = String(today.getDate());
  const shownDay = shownDate.innerHTML.split('/');

  if (shownDay[1] !== '') {
    const month = String(today.getMonth() + 1);
    const year = today.getFullYear();
    shownDate.innerHTML = `${month}/${date}/${year}`;
    /* TODO: IMPLEMENT SOME FUNCTIONALITY TO SHOW THAT DAY'S TASKS UNDER DAILY */
    changeWeeklyDates();
    changeDatesOfTheWeek();
    clearTaskContainers();
  }
}

async function test() {
  changeDailyTodo();
  createTaskContainers();
  populateWeeklyTags();
}

/**
 * When the page loads, check to make sure that the day has been updated and is correctly showing
 */
window.addEventListener('load', () => test());

/**
 * RIGHT ARROW: This event listener will move the week range forward by 7 days
 */
const weekButton = document.querySelectorAll('div > input');
weekButton[1].addEventListener('click', () => {
  const dateRange = document.querySelector('.dateRange');
  const dates = dateRange.innerHTML;
  const splitDates = dates.split(' - ');
  const firstDate = splitDates[0].split('/');
  const secondDate = splitDates[1].split('/');
  findNextWeeklyDates(Number(firstDate[0]), Number(firstDate[1]),
    Number(firstDate[2]), Number(secondDate[0]), Number(secondDate[1]), Number(secondDate[2]), 'forward');
  changeDatesOfTheWeek();
  for (let i = 0; i < 7; i += 1) document.querySelectorAll('.day > .tagContainer')[i].innerHTML = '';
  populateWeeklyTags();
});

/**
 * LEFT ARROW: This event listener will move the week range back by 7 days
 */
weekButton[0].addEventListener('click', () => {
  const dateRange = document.querySelector('.dateRange');
  const dates = dateRange.innerHTML;
  const splitDates = dates.split(' - ');
  const firstDate = splitDates[0].split('/');
  const secondDate = splitDates[1].split('/');

  findNextWeeklyDates(Number(firstDate[0]), Number(firstDate[1]),
    Number(firstDate[2]), Number(secondDate[0]), Number(secondDate[1]), Number(secondDate[2]), 'backward');
  changeDatesOfTheWeek();
  document.querySelectorAll('.day > .taskContainer').innerHTML = '';
  // const dateContainer = document.querySelector('.dateContainer');
  for (let i = 0; i < 7; i += 1) document.querySelectorAll('.day > .tagContainer')[i].innerHTML = '';
  populateWeeklyTags();
});

/**
 * SIDEBAR BUTTON IMPLEMENTATIONS
 */
const logout = document.querySelector('body > div > div.sidebar > a:nth-child(4)');
logout.addEventListener('click', () => {
  window.location = '../../public/index.html';
});
const journalsPage = document.querySelector('body > div > div.sidebar > a:nth-child(2)');
journalsPage.addEventListener('click', () => {
  window.location = '../My-Journals/my-journals.html';
});

const entriesPage = document.querySelector('body > div > div.sidebar > a:nth-child(2)');
entriesPage.addEventListener('click', {
});

/**
 * DAY OF THE WEEK BUTTONS IN WEEKLY PANEL
 */
const days = document.querySelectorAll('.day');
const shownDate = document.querySelector('body > div > div.daily > div.dateRange');

days.forEach((day) => {
  day.addEventListener('click', () => {
    shownDate.innerHTML = day.querySelector('.date').innerHTML;
    /** show entries for this day on the right side (get from database and create dom elements) */
    clearTaskContainers();
    createTaskContainers();

    const daily = document.querySelector('.daily');
    const taskEditor = document.querySelector('.daily > .taskEditor');
    if (taskEditor != null) daily.removeChild(taskEditor);
  });
});

/**
 * HELPER: Converts date from MM/DD/YYYY to YYYY-MM-DD for date comparison
 *
 * @param {*} date
 */
function formatDate(date) {
  const d = new Date(date);
  let month = `${d.getMonth() + 1}`;
  let day = `${d.getDate()}`;
  const year = d.getFullYear();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return [year, month, day].join('-');
}

/**
 * HELPER: Gets list of user selected values in edit/create new entry screen
 *
 * @param {*} select
 */
function getSelectValues(select) {
  const result = [];
  const options = select && select.options;
  let opt;
  for (let i = 0; i < options.length; i += 1) {
    opt = options[i];
    if (opt.selected) {
      result.push(opt.value || opt.text);
    }
  }
  return result;
}

/**
 * TASK EDITOR SCREEN IMPLEMENTATION
 */
const allTaskContainers = document.querySelector('.allTaskContainers');
allTaskContainers.addEventListener('click', (e) => {
  if (e.target.className !== 'taskContainer') {
    let event = e.target;
    while (event.className !== 'taskContainer') {
      event = event.parentNode;
    }
    const allTasks = document.querySelectorAll('.taskContainer');
    allTasks.forEach((task) => {
      const temp = task;
      temp.style.display = 'none';
    });
    const item = event;
    const currentTaskName = item.querySelector('.taskName');
    const currentTaskDescription = item.querySelectorAll('.taskDescription > ul > li');
    let convertedList = '';
    for (let j = 0; j < currentTaskDescription.length; j += 1) {
      const split = currentTaskDescription[j].innerHTML.split('<ul>');
      convertedList += `${split[0]}\n`;
      currentTaskDescription[j].querySelectorAll('ul > li').forEach((line) => {
        convertedList += `\t${line.innerHTML}\n`;
      });
    }
    const currentTaskDates = item.querySelector('#daily');
    const currentDates = currentTaskDates.innerHTML.split(' - ');
    const currentTaskFirstDate = currentDates[0];
    const currentTaskSecondDate = currentDates[1];
    const currJournal = item.querySelector('.task > .topLine').id;
    const todoName = item.querySelector('.task > .topLine > .taskName').innerHTML;
    const taskId = todoName.replace(/\s+/g, '').toLowerCase();

    const daily = document.querySelector('.daily');
    const taskEditor = document.createElement('div');
    taskEditor.setAttribute('class', 'taskEditor');
    taskEditor.setAttribute('id', event.childNodes[0].getAttribute('id'));
    daily.appendChild(taskEditor);

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
    displayTagName.innerHTML = 'Select Tags <br> (hold ctrl for multiple)';
    editTags.appendChild(displayTagName);

    const tagSelector = document.createElement('select');
    tagSelector.setAttribute('id', 'tagSelector');
    tagSelector.setAttribute('multiple', 'true');
    editTags.appendChild(tagSelector);

    const currentTags = item.querySelectorAll('.task > .taskDescription > .tagContainer > .tag > text');
    const currTagList = [];
    currentTags.forEach((tag) => {
      currTagList.push(tag.innerHTML);
    });

    getAllTags('User1', currJournal).then((tags) => {
      const allTags = Object.values(tags);
      allTags.forEach((tag) => {
        const appendTag = document.createElement('option');
        appendTag.innerHTML = tag;
        if (currTagList.includes(tag)) {
          appendTag.setAttribute('selected', 'selected');
        }
        tagSelector.appendChild(appendTag);
      });
    });

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
    infoForTaskStart.setAttribute('value', formatDate(currentTaskFirstDate));
    editDate.appendChild(infoForTaskStart);

    const filler = document.createElement('h3');
    filler.innerHTML = 'to';
    editDate.appendChild(filler);

    const infoForTaskEnd = document.createElement('input');
    infoForTaskEnd.setAttribute('type', 'date');
    infoForTaskEnd.setAttribute('id', 'editTaskEnd');
    infoForTaskEnd.setAttribute('name', 'editTaskEnd');
    infoForTaskEnd.setAttribute('value', formatDate(currentTaskSecondDate));
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
    textAreaForInfo.addEventListener('keydown', function (f) {
      if (f.key === 'Tab') {
        f.preventDefault();
        const start = this.selectionStart;
        const end = this.selectionEnd;

        // set textarea value to: text before caret + tab + text after caret
        this.value = `${this.value.substring(0, start)
        }\t${this.value.substring(end)}`;

        // put caret at right position again
        this.selectionStart = start + 1;
        this.selectionEnd = start + 1;
      }
    });
    textAreaForInfo.innerHTML = convertedList;

    editDescription.appendChild(textAreaForInfo);

    const submitButton = document.createElement('input');
    submitButton.setAttribute('type', 'submit');
    submitButton.setAttribute('value', 'Submit');
    taskForm.appendChild(submitButton);

    submitButton.addEventListener('click', () => {
      const newText = textAreaForInfo.value;
      daily.removeChild(taskEditor);

      const startDay = new Date(infoForTaskStart.value);
      const endDay = new Date(infoForTaskEnd.value);
      startDay.setDate(startDay.getDate() + 1);
      endDay.setDate(endDay.getDate() + 1);

      const selectedTags = getSelectValues(tagSelector);
      let createEntry = true;
      getEntries('User1', currJournal).then((entries) => {
        const obj = Object.keys(entries);
        obj.forEach((object) => {
          if (entries[object].title === currentTaskName.innerHTML) {
            if (inputTaskName.value === '') {
              alert('Entry title must not be empty!');
              createEntry = false;
            } else if (startDay > endDay) {
              alert('Start Date must be before End Date');
              createEntry = false;
            } else if (!infoForTaskStart.value || !infoForTaskEnd.value) {
              alert('The Start and End dates must be valid');
              createEntry = false;
            }
            if (currentTaskName.innerHTML !== inputTaskName.value) {
              deleteTodo('User1', currJournal, taskId);
            }
            if (createEntry) {
              createNewEntry('User1', inputTaskName.value, newText, startDay.toLocaleDateString('en-US'), endDay.toLocaleDateString('en-US'), selectedTags, currJournal);
            }
          }
        });
      });
      const tagContainers = document.querySelectorAll('.tagContainer');
      tagContainers.forEach((tag) => {
        tag.innerHTML = '';
      });
      allTasks.forEach((task) => {
        allTaskContainers.removeChild(task);
      });

      setTimeout(() => {
        populateWeeklyTags();
        createTaskContainers();
      }, 5);
    });
  }
});

/**
 * MARK TASK AS DONE
 * Right click on task container to toggle between done/not done
 */
allTaskContainers.addEventListener('contextmenu', (e) => {
  // DO SOMETHING THAT SHOWS THAT THIS TASK IS DONE
  if (e.target.className !== 'taskContainer') {
    let event = e.target;
    while (event.className !== 'taskContainer') {
      event = event.parentNode;
    }
    e.preventDefault();
    // alert('DO YOU WANT TO MARK THIS TASK AS DONE? THIS CANNOT BE UNDONE');
    const item = event;
    const task = item.querySelector('.task');
    const taskJournal = item.querySelector('.task > .topLine').id;
    const todoName = item.querySelector('.task > .topLine > .taskName').innerHTML;
    const taskId = todoName.replace(/\s+/g, '').toLowerCase();

    if (task.id.includes('NotDone')) {
      editTodo('User1', taskJournal, taskId, { isDone: true });
      const splitUp = task.id.split('Not');
      task.id = splitUp[0] + splitUp[1];
    } else {
      editTodo('User1', taskJournal, taskId, { isDone: false });
      if (task.id.includes('blue')) {
        task.id = 'blueNotDone';
      } else if (task.id.includes('red')) {
        task.id = 'redNotDone';
      } else if (task.id.includes('green')) {
        task.id = 'greenNotDone';
      } else if (task.id.includes('purple')) {
        task.id = 'purpleNotDone';
      }
    }
  }
});

document.getElementById('logout').addEventListener('click', () => {
  firebase.auth().signOut();
  window.location = '../index.html';
});

firebase.auth().onAuthStateChanged((user) => {
  if (!user) {
    window.location = '../index.html'; // If User is not logged in, redirect to login page
  }
});
