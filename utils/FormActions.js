import { validateEmail, validatePassword, validateString } from "./ValidationConstraints";

// Handles routing of form validation based on input type
export const validateFormEntry = (inputIdentifier, inputValue) => {
  if (inputIdentifier === "firstName" || inputIdentifier === "lastName") {
    return validateString(inputIdentifier, inputValue)
  } else if (inputIdentifier === "email") {
    return validateEmail(inputIdentifier, inputValue);
  } else if (inputIdentifier === "password") {
    return validatePassword(inputIdentifier, inputValue);
  }
}