import { describe, expect, it } from 'vitest';

import { ErrorFactory } from './index';

describe('ErrorFactory', () => {
  it('should set the correct name on the created error class', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    expect(TestError.name).toBe('TestError');
  });

  it('should set the correct name on the created error instance', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const error = new TestError();

    expect(error.name).toBe('TestError');
  });

  it('should set the correct message on the created error instance', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const error = new TestError();

    expect(error.message).toBe('Test error');
  });

  it('Should be possible to pass a cause option to the created error class', () => {
    class TestError extends ErrorFactory({ name: 'TestError', message: 'Test error' }) {}

    const cause = new Error('Cause error');
    const error = new TestError({ cause });

    expect(error.cause).toBe(cause);
  });

  it('should be possible to define additional fields in the error class', () => {
    class TestError extends ErrorFactory({
      name: 'TestError',
      message: 'Test error',
      fields: ErrorFactory.fields<{ field: string }>(),
    }) {}

    const error = new TestError({ field: 'field' });

    expect(error.field).toBe('field');
  });

  it('should be possible to define the message as a function that receives the additional fields', () => {
    class TestError extends ErrorFactory({
      name: 'TestError',
      message: ({ field }) => `Test error: ${field}`,
      fields: ErrorFactory.fields<{ field: string }>(),
    }) {}

    const error = new TestError({ field: 'field' });

    expect(error.message).toBe('Test error: field');
  });
});
