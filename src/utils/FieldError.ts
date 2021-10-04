export type FieldErrorType = {
  message: string;
  field: string;
  data?: any;
  name?: string;
  stack?: string;
};

class FieldError extends Error {
  field: string;
  data: any;

  constructor(error: any) {
    super();
    this.message = error?.message ?? "An unknown error has occurred";
    this.field = error?.field ?? "unknown";
    this.data = error?.data;
    this.name = error?.name;
    this.stack = error?.stack;
  }
}

export default FieldError;
