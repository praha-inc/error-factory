# @praha/error-factory

[![npm version](https://badge.fury.io/js/@praha%2Ferror-factory.svg)](https://www.npmjs.com/package/@praha/error-factory)
[![npm download](https://img.shields.io/npm/dm/@praha/error-factory.svg)](https://www.npmjs.com/package/@praha/error-factory)
[![license](https://img.shields.io/badge/License-MIT-green.svg)](https://github.com/praha-inc/error-factory/blob/main/LICENSE)
[![Github](https://img.shields.io/github/followers/praha-inc?label=Follow&logo=github&style=social)](https://github.com/orgs/praha-inc/followers)

## 🤔 Why Use Custom Error Classes?

Using custom error classes provides several benefits:

- **Consistent Error Handling**: Ensures a unified error structure across your application.
- **Better Debugging**: Enables adding additional context such as error causes, metadata, and structured messages.
- **Improved Type Safety**: When using TypeScript, custom error classes allow better type checking and inference.
- **Code Maintainability**: Reduces redundant error-handling code and keeps error logic modular and reusable.

## 👏 Getting Started

### Installation

```bash
npm install @praha/error-factory
```

### Usage

You can use ErrorFactory to create custom error classes easily, reducing boilerplate code and ensuring consistent error structures across your application.

The following demonstrates the most basic usage of ErrorFactory to define and use a custom error class.

```ts
import { ErrorFactory } from '@praha/error-factory';

// Define a custom error
const NotFoundError = ErrorFactory({
  name: 'NotFoundError',
  message: 'Resource not found',
});

// Use the custom error
try {
  throw new NotFoundError();
} catch (error) {
  console.error(error.name); // "NotFoundError"
  console.error(error.message); // "Resource not found"
}
```

You can pass additional options to the error constructor, such as cause, which is useful for debugging complex error chains by preserving the original error context.

```ts
const DatabaseError = ErrorFactory({
  name: 'DatabaseError',
  message: 'A database error occurred',
});

try {
  throw new DatabaseError({ cause: new Error('Connection failed') });
} catch (error) {
  console.error(error.name); // "DatabaseError"
  console.error(error.message); // "A database error occurred"
  console.error(error.cause); // Error: Connection failed
}
```

Customizing errors allows you to provide additional context and improve debugging by attaching relevant information to exceptions.

```ts
// Extending the generated error class for additional functionality
class QueryError extends ErrorFactory({
  name: 'QueryError',
  message: 'An error occurred while executing a query',
}) {
  constructor(
    public readonly query: string,
    options?: ErrorOptions,
  ) {
    super(options);
  }
}

try {
  throw new QueryError('SELECT * FROM users', { cause: new Error('Syntax error') });
} catch (error) {
  console.error(error.name); // "QueryError"
  console.error(error.message); // "An error occurred while executing a query"
  console.error(error.query); // "SELECT * FROM users"
  console.error(error.cause); // Error: Syntax error
}
```

### Advanced Usage: Type Narrowing with Unions

You can define multiple custom error classes and use TypeScript's type narrowing to handle them effectively based on their name property.

```ts
class NotFoundError extends ErrorFactory({
  name: 'NotFoundError',
  message: 'Resource not found',
}) {}

class ValidationError extends ErrorFactory({
  name: 'ValidationError',
  message: 'Invalid input',
}) {}

class DatabaseError extends ErrorFactory({
  name: 'DatabaseError',
  message: 'A database error occurred',
}) {}

type ApplicationError = NotFoundError | ValidationError | DatabaseError;

const handleError = (error: ApplicationError) => {
  switch (error.name) {
    case 'NotFoundError':
      console.error(`Handle not found: ${error.message}`);
      break;
    case 'ValidationError':
      console.error(`Handle validation error: ${error.message}`);
      break;
    case 'DatabaseError':
      console.error(`Handle database error: ${error.message}`);
      break;
  }
};

try {
  throw new ValidationError();
} catch (error) {
  if (error instanceof Error) {
    handleError(error as ApplicationError);
  }
}
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome.

Feel free to check [issues page](https://github.com/praha-inc/error-factory/issues) if you want to contribute.

## 📝 License

Copyright © [PrAha, Inc.](https://www.praha-inc.com/)

This project is [```MIT```](https://github.com/praha-inc/error-factory/blob/main/LICENSE) licensed.
