/**
 * Changes the weekly date range by using a Date object
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
const entriesPage = document.querySelector('body > div > div.sidebar > a:nth-child(3)');
entriesPage.addEventListener('click', () => {
});

/** Temporary implementation of each button(Sunday, Monday, Tuesday, etc.)
 *  This will change when we actaully attach tags, entries to each day
 */
const day = document.querySelectorAll('.day');
const shownDate = document.querySelector('body > div > div.daily > div.dateRange');
const dailyTaskDate = document.querySelectorAll('div > h3 > span');
day[0].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[0].innerHTML;
});
day[1].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[1].innerHTML;
});
day[2].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[2].innerHTML;
});
day[3].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[3].innerHTML;
});
day[4].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[4].innerHTML;
});
day[5].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[5].innerHTML;
});
day[6].addEventListener('click', () => {
  shownDate.innerHTML = dailyTaskDate[6].innerHTML;
});
