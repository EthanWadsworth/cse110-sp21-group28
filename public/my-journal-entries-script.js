import {
    createNewUser, getNewJournalId, createNewJournal,
    deleteJournal, editJournal, newTag, deleteTag,
    getNewTodoId, createNewEntry, deleteTodo, editTodo,
    getAllJournals, getEntries, getAllEntries, getAllJournalsAsync, getAllTags, getJournal
  } from './backend_script.js?4';
  
  var currentJournal = ""
  // console.log(getJournal('User1', "CSE110"));
  
  // createNewJournal('User1', 'CSE110', 'Software Engineering');
  //createNewEntry('User1', 'Finish Lab 3', 'Fork Github repo', '5/6/2021', '5/11/2021', ['Lab', 'Github', 'CSE110'], 'CSE110');
  
  // Function to get NAMES of journals that have tasks at CURRENT date (for Weekly Panel "Tags")
  async function getCurrentJournals(currentDate) {
    const currJournals = [];
    const journals = await getAllJournalsAsync('User1');
    const names = Object.keys(journals);
    names.forEach((name) => {
      const { entries } = journals[name];
      const obj = Object.keys(entries);
      obj.forEach((entry) => {
        const startDate = new Date(entries[entry].start_date);
        const endDate = new Date(entries[entry].end_date);
        const currDate = new Date(currentDate);
        if (startDate <= currDate && currDate <= endDate) {
          currJournals.push([name, journals[name].color]);
        }
      })
    })
    return currJournals;
  }
  
  // Test
  // Function to get all the entries that are still active at CURRENT date (for Daily Panel)
  async function getCurrentEvents(currentDate) {
    const rangedEntries = [];
    return new Promise(async (resolve) => {
      getEntries('User1', currentJournal).then((entries) => {
        
        for (const [key, value] of Object.entries(entries)) {
          const startDate = new Date(value.start_date);
          const endDate = new Date(value.end_date);
          const currDate = new Date(currentDate);
          if (startDate <= currDate && currDate <= endDate) {
            rangedEntries.push([key, value]);
          }
        }
        
      }).then(() => resolve(rangedEntries));
    });
  }
  
  
  
  // Function to get NUMBER of active tasks at CURRENT date
  async function getNumTasks(currentDate) {
    return new Promise((resolve) => {
      getCurrentEvents(currentDate).then((result) => resolve(result.length));
    });
  }
  
  async function populateWeeklyTags() {
    const weekRange = document.querySelector('.dateRange');
    const dates = weekRange.innerHTML;
    const splitDates = dates.split(' - ');
    const firstDate = new Date(splitDates[0].split('/'))
    const endDate = new Date(splitDates[1].split('/'))
    let currDate = firstDate;
    for (let i = 0; i < 7; i += 1) {
      var curr_date = currDate.getDate();
      var curr_month = currDate.getMonth();
      curr_month += 1;
      var curr_year = currDate.getFullYear();
      const currJournal = await getJournal('User1', currentJournal);
  
      getNumTasks(curr_month + "/" + curr_date + "/" + curr_year).then((result) => {
        if (result > 0) {
          const dateContainer = document.querySelectorAll('.day > .tagContainer')[i]
          const newTag = document.createElement('div');
          newTag.setAttribute('class', 'tag');
          newTag.setAttribute('id', currJournal.color);
          newTag.innerHTML = "<text>" + currentJournal + "</text>";
          dateContainer.appendChild(newTag);
        }
        const taskNum = document.querySelectorAll('.day > .topLine > .tasks > span');
        taskNum[i].innerHTML = result + " ";
      });
      currDate.setDate(currDate.getDate() + 1)
    }
  }
  
  /**
   *  USE DOM ELEMENTS TO SHOW ALL TASKS.
  */
  async function createTaskContainers() {
    const shownDate = document.querySelector('body > div.wrapper > div.daily > div.dateRange');
    const rangedEntries = await getCurrentEvents(shownDate.innerHTML);
    const currJournal = await getJournal('User1', currentJournal);
    var i = 0;
    rangedEntries.forEach((entry) => {
      const daily = document.querySelector('.allTaskContainers');
      const taskContainer = document.createElement('div');
      taskContainer.setAttribute('class', 'taskContainer');
      taskContainer.setAttribute('id', '' + i + '');
      i = i + 1;
      daily.appendChild(taskContainer);
  
      const task = document.createElement('div');
      task.setAttribute('class', 'task');
  
      taskContainer.appendChild(task);
  
      const topLine = document.createElement('div');
      topLine.setAttribute('class', 'topLine');
      task.appendChild(topLine);
  
      const taskName = document.createElement('div');
      taskName.setAttribute('class', 'taskName');
      taskName.innerHTML = entry[1].title;
      topLine.appendChild(taskName);
  
      const dateRange = document.createElement('div');
      dateRange.setAttribute('class', 'dateRange');
      dateRange.setAttribute('id', 'daily');
      dateRange.innerHTML = `${entry[1].start_date} - ${entry[1].end_date}`;
      topLine.appendChild(dateRange);
  
      const taskDescription = document.createElement('div');
      taskDescription.setAttribute('class', 'taskDescription');
      task.appendChild(taskDescription);
  
      const list = entry[1].description.split("\n");
      list.forEach((element) => {
        if (element != ''){
          const tempList = document.createElement('li');
          tempList.innerHTML = element;
          taskDescription.appendChild(tempList);
        }
      })
  
      const tagContainer = document.createElement('div');
      tagContainer.setAttribute('class', 'tagContainer');
      taskDescription.appendChild(tagContainer);
  
      const tags = entry[1].tags;
  
      for (let i = 0; i < tags.length; i += 1) {
          const tag = document.createElement('div');
          tag.setAttribute('class', 'tag');
          tag.setAttribute('id', currJournal.color)
          const text = document.createElement('text');
          text.innerHTML = tags[i];
          tag.appendChild(text);
          tagContainer.appendChild(tag);
      }
  
      if (entry[1].isDone) {
          task.setAttribute('id', currJournal.color + "Done");
      } else {
          task.setAttribute('id', currJournal.color + "NotDone");
      }
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
  
  }
  
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
  
  
  function clearTaskContainers() {
    const removeTaskContainers = document.querySelectorAll('.taskContainer');
    removeTaskContainers.forEach((container) => {
      container.parentNode.removeChild(container);
    })
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
      clearTaskContainers();
  
    }
  }
  /**
   * When the page loads, check to make sure that the day has been updated and is correctly showing
   */
  window.addEventListener('load', (event) => {
    currentJournal = "CSE110"
    changeDailyTodo();
    createTaskContainers();
    // for (var i = 0; i < 7; i += 1) {
    //   document.querySelectorAll('.day > .tagContainer')[i].innerHTML = "";
    //   document.querySelectorAll('.day > .topLine > .tasks > span')[i].innerHTML = "0 ";
    // }
    populateWeeklyTags();
  
  });
  
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
    for (var i = 0; i < 7; i += 1) document.querySelectorAll('.day > .tagContainer')[i].innerHTML = "";
    populateWeeklyTags();
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
  
    findNextWeeklyDates(Number(firstDate[0]), Number(firstDate[1]),
      Number(firstDate[2]), Number(secondDate[0]), Number(secondDate[1]), Number(secondDate[2]), 'backward');
    changeDatesOfTheWeek();
    document.querySelectorAll('.day > .taskContainer').innerHTML = "";
    // const dateContainer = document.querySelector('.dateContainer');
    for (var i = 0; i < 7; i += 1) document.querySelectorAll('.day > .tagContainer')[i].innerHTML = "";
    populateWeeklyTags();
  });
  /*
  // ALL OF THE BUTTON IMPLEMENTATIONS FOR THE SIDEBAR
  const logout = document.querySelector('body > div > div.sidebar > a:nth-child(6)');
  logout.addEventListener('click', () => {
    window.location = '../../public/index.html';
  });
  const journalsPage = document.querySelector('body > div > div.sidebar > a:nth-child(2)');
  journalsPage.addEventListener('click', () => {
    window.location = '../My-Journals/my-journals.html';
  });
   
  const entriesPage = document.querySelector('body > div > div.sidebar > a:nth-child(3)');
  entriesPage.addEventListener('click', {
  });
  */
  const tagPage = document.querySelector('body > div.wrapper > div.sidebar > a:nth-child(5)');
  tagPage.addEventListener('click', {
  });
  
  /** EVENTLISTENERS for button(Sunday, Monday, Tuesday, etc.) */
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
  
  /** Double click on a task to edit (edit screen shows up)
   *  Once user presses submit, database should update existing info with what was just inputted
   */
  
  function formatDate(date) {
    const d = new Date(date);
    var month = '' + (d.getMonth() + 1);
    var day = '' + d.getDate();
    var year = d.getFullYear();
    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;
    return [year, month, day].join('-');
  }
  
  // From StackOverflow
  function getSelectValues(select) {
    var result = [];
    var options = select && select.options;
    var opt;
    for (var i = 0; i < options.length; i += 1) {
      opt = options[i];
      if (opt.selected) {
        result.push(opt.value || opt.text);
      }
    }
    return result;
  }
  
  const allTaskContainers = document.querySelector('.allTaskContainers');
  allTaskContainers.addEventListener('click', function (e) {
    if (e.target.className !== "taskContainer") {
      let event = e.target;
      while (event.className != 'taskContainer') {
        event = event.parentNode;
      }
      const allTasks = document.querySelectorAll('.taskContainer');
      allTasks.forEach((task) => {
        task.style.display = 'none';
      });
      let item = event;
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
      const currJournal = currentJournal;
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
      const currentTags = item.querySelectorAll('.task > .taskDescription > .tagContainer > .tag > text');
      const currTagList = []
      currentTags.forEach((tag) => {
        currTagList.push(tag.innerHTML);
      })
  
      getAllTags('User1', currJournal).then((tags) => {
        const allTags = Object.values(tags);
        allTags.forEach((tag) => {
          const appendTag = document.createElement('option');
          appendTag.innerHTML = tag;
          if (currTagList.includes(tag)) {
            appendTag.setAttribute('selected', 'selected');
          }
          tagSelector.appendChild(appendTag);
        })
      })
  
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
      // infoForTaskStart.value = currentTaskFirstDate;
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
      textAreaForInfo.innerHTML = convertedList;
  
      editDescription.appendChild(textAreaForInfo);
  
      const submitButton = document.createElement('input');
      submitButton.setAttribute('type', 'submit');
      submitButton.setAttribute('value', 'Submit');
      taskForm.appendChild(submitButton);
  
      submitButton.addEventListener('click', () => {
        const newText = textAreaForInfo.value;
        daily.removeChild(taskEditor);
  
        let startDay = new Date(infoForTaskStart.value);
        let endDay = new Date(infoForTaskEnd.value);
        startDay.setDate(startDay.getDate() + 1);
        endDay.setDate(endDay.getDate() + 1);
  
        const selectedTags = getSelectValues(tagSelector);
        getEntries('User1', currJournal).then((entries) => {
          const obj = Object.keys(entries);
          obj.forEach((object) => {
            if (entries[object].title == currentTaskName.innerHTML) {
              if (currentTaskName.innerHTML != inputTaskName.value) {
                deleteTodo('User1', currJournal, taskId);
              }
              createNewEntry('User1', inputTaskName.value, newText, startDay.toLocaleDateString('en-US'), endDay.toLocaleDateString('en-US'), selectedTags, currJournal);
            }
          })
        })
        const tagContainers = document.querySelectorAll('.tagContainer');
        tagContainers.forEach((tag) => {
          tag.innerHTML = "";
        })
        allTasks.forEach((task) => {
          allTaskContainers.removeChild(task)
        });
  
        setTimeout(function () {
          populateWeeklyTags();
          createTaskContainers();
        }, 100);
      });
    }
  });
  
  /** MARK AS DONE: NOT DELETE TASKS */
  allTaskContainers.addEventListener('contextmenu', function (e) {
    // DO SOMETHING THAT SHOWS THAT THIS TASK IS DONE
    if (e.target.className !== "taskContainer") {
      let event = e.target;
      while (event.className != 'taskContainer') {
        event = event.parentNode;
      }
      e.preventDefault();
      //alert('DO YOU WANT TO MARK THIS TASK AS DONE? THIS CANNOT BE UNDONE');
      var item = event;
      const task = item.querySelector('.task');
      const todoName = item.querySelector('.task > .topLine > .taskName').innerHTML;
      const taskId = todoName.replace(/\s+/g, '').toLowerCase();
      console.log(task.id)
      if (task.id.includes('NotDone')) {
        editTodo('User1', currentJournal, taskId, { isDone: true });
        var splitUp = task.id.split('Not');
        task.id = splitUp[0] + splitUp[1];
      } else {
        editTodo('User1', currentJournal, taskId, { isDone: false });
        if (task.id.includes('blue')) {
          task.id = "blueNotDone";
        } else if (task.id.includes('red')) {
          task.id = "redNotDone";
        } else if (task.id.includes('green')) {
          task.id = "greenNotDone";
        } else if (task.id.includes('purple')) {
          task.id = "purpleNotDone";
        }
      }
    }
  });
  
  const newTaskButton = document.querySelector('body > div.wrapper > div.sidebar > a:nth-child(4)');
  var journ = await getJournal('User1', currentJournal);
  var color = journ[Object.keys(journ)[0]].color;
  newTaskButton.addEventListener('click', () => {
    const wrapper = document.querySelector('.wrapper');
    const dailyPage = document.querySelector('body > div > div.daily');
    wrapper.removeChild(dailyPage)
    //dailyPage.style.display = 'none';
    
  
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
    
    console.log(color)
    taskEditor.setAttribute('id', color + "Done");
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
  
    getAllTags('User1', currentJournal).then((tags) => {
      const allTags = Object.values(tags);
      allTags.forEach((tag) => {
        const appendTag = document.createElement('option');
        appendTag.innerHTML = tag;
        tagSelector.appendChild(appendTag);
      })
    })
  
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
  
    const submitButton = document.createElement('button');
    submitButton.setAttribute('type', 'button');
    submitButton.setAttribute('value', 'Submit');
    taskForm.appendChild(submitButton);
  
    submitButton.addEventListener('click', () => {
        let newText = textAreaForInfo.value;
      //   console.log(newText)
        let objectText = textAreaForInfo.value.split('\n');
        addTask.style.display = 'none';
        wrapper.appendChild(dailyPage);
        //dailyPage.style.display = 'block';;
        
         let startDay = new Date(infoForTaskStart.value);
         let endDay = new Date(infoForTaskEnd.value);
         startDay.setDate(startDay.getDate() + 1);
         endDay.setDate(endDay.getDate() + 1);
  
        const selectedTags = getSelectValues(tagSelector);
  
        createNewEntry('User1', inputTaskName.value, newText, startDay.toLocaleDateString('en-US'), endDay.toLocaleDateString('en-US'), selectedTags, currentJournal);
  
        const tagContainers = document.querySelectorAll('.tagContainer');
        tagContainers.forEach((tag) => {
          tag.innerHTML = "";
        })
        
        const allTaskContainers = document.querySelector('.allTaskContainers');
        const allTasks = document.querySelectorAll('.taskContainer');
        allTasks.forEach((task) => {
         allTaskContainers.removeChild(task)
        });
  
         setTimeout(function () {
           populateWeeklyTags();
           createTaskContainers();
         }, 100);
      });
  
      // wrapper.removeChild(addTask);
      // dailyPage.style.display = 'block';
      // changeDailyTodo();
      //changeWeeklyDates();
      //changeDatesOfTheWeek();
  });