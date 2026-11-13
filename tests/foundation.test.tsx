import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fc from 'fast-check';
import { deleteDB, openDB } from 'idb';
import { expect, test } from 'vitest';
import { indexedDbNumRuns, numRuns } from './helpers/property';

test('Vitest runs a basic assertion', () => {
  expect(1 + 1).toBe(2);
});

test('fast-check uses the shared iteration budget', () => {
  expect(fc.readConfigureGlobal().numRuns).toBe(numRuns);
  expect(indexedDbNumRuns).toBe(25);
  fc.assert(fc.property(fc.integer(), (value) => Number.isInteger(value)));
});

test('React Testing Library and user-event work in jsdom', async () => {
  function Counter() {
    const [count, setCount] = React.useState(0);
    return <button onClick={() => setCount(count + 1)}>Count {count}</button>;
  }

  const user = userEvent.setup();
  render(<Counter />);
  await user.click(screen.getByRole('button', { name: 'Count 0' }));
  expect(screen.getByRole('button', { name: 'Count 1' })).toBeTruthy();
});

test('fake-indexeddb supports an isolated database round trip', async () => {
  const name = 'resibowise-testing-foundation';
  const db = await openDB(name, 1, {
    upgrade(database) {
      database.createObjectStore('checks');
    },
  });

  try {
    await db.put('checks', 'ready', 'status');
    expect(await db.get('checks', 'status')).toBe('ready');
  } finally {
    db.close();
    await deleteDB(name);
  }
});
