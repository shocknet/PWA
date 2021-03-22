import { AxiosError } from "axios";
import FieldError, { FieldErrorType } from "./FieldError";

type MixedError = Error | AxiosError | FieldErrorType;

export const parseError = (error: MixedError) => {
  if ("response" in error) {
    const response = error.response?.data;
    return new FieldError({
      field: response?.field ?? "unknown",
      message: response?.errorMessage ?? "An unknown error has occurred"
    });
  }

  return new FieldError({
    field: ("field" in error && error.field) ?? "unknown",
    message: error.message ?? "An unknown error has occurred"
  });
};
