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

    expect(error.cause).toBe(cause);
  });

  it('should allow for the definition of additional fields', () => {
    class TestError extends ErrorFactory({
      name: 'TestError',
      message: 'Test error',
      fields: ErrorFactory.fields<{ field: string }>(),
    }) {}

    const error = new TestError({ field: 'field' });

    expect(error.field).toBe('field');
  });
});
