export const router = {};

const body = document.body;
const journalContainer = document.getElementById('journal-entries');
const entriesContainer = document.querySelector('.entries-container');


/**
 * 
 * @param {*} state current page to go to 
 * @param {*} statePopped whether call came from popstate
 * @param {*} data journal/entry identifier
 */
router.setState = (state, statePopped, data) => {
    console.log(data);
    switch(state) {
        case 'entry':
            journalsPage(false);
            entriesPage(false);
            viewEntry(true, data);
            break;
        case 'entries':
            journalsPage(false);
            entriesPage(true, data);
            viewEntry(false);
            break;
        default:
            journalsPage(true);
            entriesPage(false);
            viewEntry(false);
    }

    if(!statePopped && window.location.hash != `#${state}`) {
        pushToHistory(state, data);
    }
}


/**
 * 
 * @param {*} sendTo true if going to the view journals page
 */
function journalsPage(sendTo) {
    if (sendTo) {
        journalContainer.classList.add('journals');
    } else {
        journalContainer.classList.remove('journals');
    }
}


/**
 * 
 * @param {boolean} sendTo true if you are going to the page, false otherwise
 * @param {*} journal name of journal you are getting entries for
 */
function entriesPage(sendTo, journal) {
    if (sendTo) {
        journalContainer.classList.add('entries');
    } else {
        journalContainer.classList.remove('entries');
    }
}

/**
 * 
 * @param {*} sendTo true if going to the view entry page
 * @param {*} entryId identifier of entry to display
 */
function viewEntry(sendTo, entryId) {
    if (sendTo) {
        journalContainer.classList.add('single-entry');
    } else {
        journalContainer.classList.remove('single-entry');
    }
}

/**
 * Push a new state to the history stack
 * @param {string} state The new page to set the state of
 * @param {number} data if page has identifier like journal or specific entry
*/
export function pushToHistory(state, data) {
    switch (state) {
      case 'entries':
        history.pushState({ page: 'entries' }, '', `./#${data}`);
        break;
      case 'entry':
        history.pushState({ page: `entry${data}` }, '', `./#entry-${data}`);
        break;
      default:
        history.pushState({}, '', './journals');
    }
    return history;
}