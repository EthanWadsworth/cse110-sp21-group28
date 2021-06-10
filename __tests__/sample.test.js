const { expect } = require('@jest/globals');

test('1 + 2 = 3', () => {
  expect(1 + 2).toBe(3);
});

test('2 - 1 = 1', () => {
  expect(2 - 1).toBe(1);
});

test('3 - 1 = 2', () => {
  expect(3 - 1).toBe(2);
});

test('3 - 3 = 0', () => {
  expect(3 - 3).toBe(0);
});
