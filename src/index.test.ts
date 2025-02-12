import { describe, expect, it } from 'vitest';

import { ErrorFactory } from './index';

describe('ErrorFactory', () => {
  it('should set the correct name on the created error', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const error = new TestError();

    expect(error.name).toBe('TestError');
  });

  it('should set the correct message on the created error', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const error = new TestError();

    expect(error.message).toBe('Test error');
  });

  it('should allow passing the cause option to the created error', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const cause = new Error('Cause error');
    const error = new TestError({ cause });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-member-access
    expect((error as any)['cause']).toBe(cause);
  });
});
