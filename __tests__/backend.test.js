import { describe, expect } from '@jest/globals';

import {
  createNewJournal, deleteJournal, editJournal,
  createNewEntry, deleteTodo, editTodo,
  getEntries, getAllEntries, getAllJournalsAsync,
  getAllTags, getJournal,
} from '../public/backend/backend_script_testing.js';

describe('Basic user flow for firebase database ', () => {
  // Test 1
  it('Test1: Test that firebase can get all entries from a specific journal from a user', async () => {
    const thisEntry = await getEntries('test', 'CSE110');
    const entryObj = {
      tests: {
        description: 'Finish unit tests',
        end_date: '6/10/2021',
        isDone: false,
        parentJournal: 'CSE110',
        start_date: '6/10/2021',
        tags: [
          'Coding',
          'Project',
        ],
        title: 'Tests',
      },
    };
    expect(thisEntry).toEqual(entryObj);
  });

  // Test 2
  it('Test2: Test that backend function get all tags from a journal works', async () => {
    const thisTag = await getAllTags('test', 'CSE110');
    const tag = 'Labs';
    expect(thisTag).toBe(tag);
  });
  // Test 3
  it('Test3: Test that backend function can get a journal from a user', async () => {
    const thisJournal = await getJournal('test', 'ECE101');
    const journalObj = {
      color: 'red',
      entries: {
        lab5: {
          description: 'Fourier Transform',
          end_date: '5/12/2021',
          isDone: false,
          parentJournal: 'ECE101',
          start_date: '5/12/2021',
          tags: [
            'Hard',
            'Lab',
          ],
          title: 'Lab 5',
        },
      },
      journalDescription: '',
    };
    expect(thisJournal).toEqual(journalObj);
  });

  // Test 4
  it('Test4: User can add a journal to their account', async () => {
    // add user
    createNewJournal('test', 'CSE135', '', 'red');

    // attempt to grab the new journal and check for equality
    const result = await getAllJournalsAsync('test');
    const objectAdded = result.CSE135;
    expect(objectAdded).toEqual({ color: 'red', journalDescription: '' });
  });

  // Test 5
  it('Test5: User can add an entry to a specific journal', async () => {
    const user = 'test';
    const todoName = 'Tests';
    const todoDesc = 'Finish unit tests';
    const start = '6/10/2021';
    const end = '6/10/2021';
    const todotags = ['Coding', 'Project'];
    const journalId = 'CSE110';
    createNewEntry(user, todoName, todoDesc, start, end, todotags, journalId);

    const journals = await getAllJournalsAsync('test');
    const journalAddedTo = journals[journalId];
    expect(journalAddedTo).toEqual({
      entries: {
        tests: {
          description: todoDesc,
          end_date: end,
          start_date: start,
          parentJournal: journalId,
          isDone: false,
          tags: todotags,
          title: todoName,
        },
      },
      tags: 'Labs',
    });
  });

  // Test 6
  it('Test 6: User can edit journal properties', async () => {
    // edit color of journal
    createNewJournal('test', 'CSE151B', 'Hi', 'red');
    editJournal('test', 'CSE151B', 'color', 'green');

    const result = await getAllJournalsAsync('test');
    const object = result.CSE151B;
    expect(object).toEqual({ color: 'green', journalDescription: 'Hi' });
  });

  // Test 7
  it('Test 7: User can edit entry properties', async () => {
    createNewJournal('test', 'ECE101', '', 'red');
    createNewEntry('test', 'Lab 5', 'Fourier Transform', '5/10/2021', '5/12/2021', ['Hard', 'Lab'], 'ECE101');
    editTodo('test', 'ECE101', 'lab5', { start_date: '5/12/2021' });
    const result = await getAllJournalsAsync('test');
    const date = result.ECE101.entries.lab5.start_date;

    // edit start date and end dates of entry
    // editTodo('test', 'ECE101', 'Lab 5', { start_date: '5/12/2021' });
    expect(date).toBe('5/12/2021');
  });

  // Test 8
  it('Test8: User can delete an entry from their journal', async () => {
    deleteTodo('test', 'ECE 101', 'Lab 5');

    const result = await getAllJournalsAsync('test');

    expect(result['ECE 101']).toBe(undefined);
  });

  // Test 9
  it('Test 9: User can delete a journal from their account', async () => {
    deleteJournal('test', 'ECE 101');

    const result = await getAllJournalsAsync('test');
    expect(result['ECE 101']).toBe(undefined);
  });

  // Test 10
  it('Test 10: User can get all entries across ALL journals', async () => {
    const result = await getAllEntries('test');
    const entry1 = {
      tests: {
        description: 'Finish unit tests',
        end_date: '6/10/2021',
        isDone: false,
        parentJournal: 'CSE110',
        start_date: '6/10/2021',
        tags: [
          'Coding',
          'Project',
        ],
        title: 'Tests',
      },
    };

    const entry2 = {
      lab5: {
        description: 'Fourier Transform',
        end_date: '5/12/2021',
        isDone: false,
        parentJournal: 'ECE101',
        start_date: '5/12/2021',
        tags: [
          'Hard',
          'Lab',
        ],
        title: 'Lab 5',
      },
    };

    expect(result[0]).toEqual(entry1);
    expect(result[1]).toEqual(entry2);
  });
});
