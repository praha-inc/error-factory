type DisallowKeys<K extends PropertyKey> = { [P in K]?: never };

type HasRequired<T> = {
  [K in keyof T]-?: {} extends Pick<T, K> ? never : K
}[keyof T] extends never ? false : true;

type ErrorFields = DisallowKeys<keyof Error> & Record<string, unknown>;

type ErrorConstructor<
  Name extends string,
  Message extends string,
  Fields extends ErrorFields,
> = ErrorFields extends Fields
  ? new(options?: ErrorOptions) => Error & Readonly<{ name: Name; message: Message }>
  : HasRequired<Fields> extends true
    ? new(options: ErrorOptions & Fields) => Error & Readonly<{ name: Name; message: Message }> & Readonly<Fields>
    : new(options?: ErrorOptions & Fields) => Error & Readonly<{ name: Name; message: Message }> & Readonly<Fields>;

const ErrorFactory = <
  Name extends string,
  Message extends string,
  Fields extends ErrorFields,
>(props: {
  name: Name;
  message: Message;
  fields?: Fields;
}): ErrorConstructor<Name, Message, Fields> => {
  abstract class Class extends Error {
    public override readonly name = props.name;
    public static readonly message = props.message;

    protected constructor(options?: ErrorOptions & Fields) {
      const { cause, ...fields } = options ?? {};
      super(props.message, { cause });
      Object.assign(this, fields);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};

ErrorFactory.fields = <Fields extends ErrorFields>() => undefined as unknown as Fields;

export { ErrorFactory };
