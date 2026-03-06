type DisallowKeys<K extends PropertyKey> = { [P in K]?: never };

type HasRequired<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T] extends never ? false : true;

type ErrorFields = DisallowKeys<keyof Error> & Record<string, unknown>;

type ErrorInstance<
  Name extends string,
  Message extends string,
  Fields extends ErrorFields,
> = ErrorFields extends Fields
  ? Error & Readonly<{ name: Name; message: Message }>
  : Error & Readonly<{ name: Name; message: Message }> & Readonly<Fields>;

type ErrorConstructor<
  Name extends string,
  Message extends string,
  Fields extends ErrorFields,
> = ErrorFields extends Fields
  ? (new(options?: ErrorOptions) => ErrorInstance<Name, Message, Fields>) & { name: Name }
  : HasRequired<Fields> extends true
    ? (new(options: ErrorOptions & Fields) => ErrorInstance<Name, Message, Fields>) & { name: Name }
    : (new(options?: ErrorOptions & Fields) => ErrorInstance<Name, Message, Fields>) & { name: Name };

/**
 * A factory function that creates a base class for custom error types.
 *
 * Extend the returned class to define a custom error with a consistent structure,
 * reducing boilerplate and ensuring type safety across your application.
 *
 * @typeParam Name - Inferred as a string literal type from `props.name` when provided,
 *   or defaults to `string` when `name` is omitted.
 * @typeParam Message - Inferred as a string literal type from `props.message` when it is a string,
 *   or defaults to `string` when `message` is a function.
 * @typeParam Fields - Inferred from `props.fields` (via {@link ErrorFactory.fields}).
 *   Defaults to the base `ErrorFields` constraint when `fields` is omitted.
 *
 * @param props - Configuration for the error class.
 * @param props.name - The value set as the `name` property on both the class and each instance.
 *   When omitted, `name` is inferred as `string` and set to `new.target.name` at construction time,
 *   which resolves to the name of the concrete subclass. Note that omitting `name` disables
 *   type narrowing via the `name` property; use `name` explicitly or `instanceof` for narrowing.
 * @param props.message - The error message. Can be a static string or a function that receives
 *   the custom fields and returns a string, enabling dynamic message generation.
 * @param props.fields - A type-level placeholder that declares the additional fields the error
 *   instance will carry. Use {@link ErrorFactory.fields} to create this value.
 *   When omitted, no additional fields are added to the instance.
 *
 * @returns An abstract base class typed as {@link ErrorConstructor} that should be extended
 *   to produce a concrete custom error class.
 *
 * @example Basic usage
 * ```ts
 * class NotFoundError extends ErrorFactory({
 *   name: 'NotFoundError',
 *   message: 'Resource not found',
 * }) {}
 *
 * const error = new NotFoundError();
 * console.error(error.name);    // "NotFoundError"
 * console.error(error.message); // "Resource not found"
 * ```
 *
 * @example Omitting name
 * ```ts
 * class NotFoundError extends ErrorFactory({
 *   message: 'Resource not found',
 * }) {}
 *
 * const error = new NotFoundError();
 * console.error(error.name); // "NotFoundError" (resolved from new.target.name)
 * ```
 *
 * @example With cause
 * ```ts
 * class DatabaseError extends ErrorFactory({
 *   name: 'DatabaseError',
 *   message: 'A database error occurred',
 * }) {}
 *
 * const error = new DatabaseError({ cause: new Error('Connection failed') });
 * console.error(error.cause); // Error: Connection failed
 * ```
 *
 * @example With additional fields
 * ```ts
 * class QueryError extends ErrorFactory({
 *   name: 'QueryError',
 *   message: 'An error occurred while executing a query',
 *   fields: ErrorFactory.fields<{ query: string }>(),
 * }) {}
 *
 * const error = new QueryError({ query: 'SELECT * FROM users' });
 * console.error(error.query); // "SELECT * FROM users"
 * ```
 *
 * @example Dynamic message
 * ```ts
 * class ValidationError extends ErrorFactory({
 *   name: 'ValidationError',
 *   message: ({ field }) => `Validation failed for field '${field}'`,
 *   fields: ErrorFactory.fields<{ field: string }>(),
 * }) {}
 *
 * const error = new ValidationError({ field: 'email' });
 * console.error(error.message); // "Validation failed for field 'email'"
 * ```
 */
const ErrorFactory = <
  Name extends string = string,
  Message extends string = string,
  Fields extends ErrorFields = ErrorFields,
>(props: {
  name?: Name;
  message: Message | ((fields: Fields) => Message);
  fields?: Fields;
}): ErrorConstructor<Name, Message, Fields> => {
  abstract class Class extends Error {
    public override readonly name: string;

    protected constructor(options?: ErrorOptions & Fields) {
      const { cause, ...fields } = options ?? {};
      super(typeof props.message === 'function' ? props.message(fields as Fields) : props.message, { cause });
      this.name = props.name ?? new.target.name;
      Object.assign(this, fields);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};

/**
 * A helper that declares the type of additional custom fields for an error class created by {@link ErrorFactory}.
 *
 * This function exists solely to convey type information to TypeScript; it returns `undefined` at runtime.
 * Pass its return value to the `fields` option of {@link ErrorFactory} to attach typed custom properties
 * to error instances.
 *
 * Keys in `Fields` must not overlap with properties of the built-in `Error` interface
 * (e.g. `name`, `message`, `stack`).
 *
 * @typeParam Fields - The shape of the custom fields to declare.
 *
 * @returns `undefined` at runtime (typed as `Fields` for the compiler).
 *
 * @example
 * ```ts
 * class QueryError extends ErrorFactory({
 *   name: 'QueryError',
 *   message: 'Query failed',
 *   fields: ErrorFactory.fields<{ query: string; durationMs: number }>(),
 * }) {}
 *
 * const error = new QueryError({ query: 'SELECT 1', durationMs: 42 });
 * console.error(error.query);      // "SELECT 1"
 * console.error(error.durationMs); // 42
 * ```
 */
ErrorFactory.fields = <Fields extends ErrorFields>() => undefined as unknown as Fields;

export { ErrorFactory };
