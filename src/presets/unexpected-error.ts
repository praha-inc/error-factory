import { ErrorFactory } from '../index';

export class UnexpectedError extends ErrorFactory({
  name: 'UnexpectedError',
  message: 'An unexpected error has occurred',
}) {}
