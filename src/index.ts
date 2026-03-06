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

ErrorFactory.fields = <Fields extends ErrorFields>() => undefined as unknown as Fields;

export { ErrorFactory };
