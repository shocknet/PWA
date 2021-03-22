export type FieldErrorType = {
  message: string;
  field: string;
  name?: string;
  stack?: string;
};

class FieldError extends Error {
  field: string;

  constructor(error: any) {
    super();
    this.message = error?.message ?? "An unknown error has occurred";
    this.field = error?.field ?? "unknown";
    this.name = error?.name;
    this.stack = error?.stack;
  }
}

export default FieldError;
