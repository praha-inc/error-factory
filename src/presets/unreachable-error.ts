import { ErrorFactory } from '../index';

export class UnreachableError extends ErrorFactory({
  name: 'UnreachableError',
  message: 'Reached code that should be unreachable',
}) {}
