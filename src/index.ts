export const ErrorFactory = <Name extends string>(
  { name, message }: { name: Name; message: string },
): new(options?: ErrorOptions) => Error & Readonly<{ name: Name }> => {
  abstract class Class extends Error {
    public override readonly name = name;
    public static readonly message = message;

    protected constructor(options?: ErrorOptions) {
      super(Class.message, options);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/no-unsafe-return
  return Class as any;
};
