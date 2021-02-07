class FieldError extends Error {
  constructor(error) {
    super(error);
    this.message = error?.message ?? "An unknown error has occurred";
    this.field = error?.field ?? "unknown";
    this.name = error?.name;
    this.stack = error?.stack;
  }
}

export default FieldError;
