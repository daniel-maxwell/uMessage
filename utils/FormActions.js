import {
  validateEmail,
  validatePassword,
  validateString,
  validateLength,
} from "./ValidationConstraints";

// Handles routing of form validation based on input type
export const validateFormEntry = (inputIdentifier, inputValue) => {
  if (inputIdentifier === "firstName" || inputIdentifier === "lastName") {
    return validateString(inputIdentifier, inputValue);
  } else if (inputIdentifier === "email") {
    return validateEmail(inputIdentifier, inputValue);
  } else if (inputIdentifier === "password") {
    return validatePassword(inputIdentifier, inputValue);
  } else if (inputIdentifier === "bio") {
    return validateLength(inputIdentifier, inputValue, 0, 150, true);
  }
};
