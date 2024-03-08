// Library Imports
import { validate } from "validate.js";

// Validation Constraints for Authentication Forms
export const validateString = (identifier, value) => {
  /* Do not allow empty string */
  const constraints = {
        presence: { allowEmpty: false }
    };

  /* If value not empty or undefined, format must be letters only */
  if (value !== "" && value !== undefined) {
    constraints.format = {
      pattern: "[a-zA-Z]+",
      message: "can only contain letters",
    };
  }

  // Validate the value against the constraints
  res = validate(
    { [identifier]: value },
    { [identifier]: constraints }
  );

  return res && res[identifier];
};

export const validateEmail = (identifier, value) => {
  /* Do not allow empty string */
  const constraints = {
      presence: { allowEmpty: false }
  };

  /* If value not empty or undefined, format must be letters only */
  if (value !== "") {
    constraints.email = true;
  }

  // Validate the value against the constraints
  res = validate(
    { [identifier]: value },
    { [identifier]: constraints }
  );

  return res && res[identifier];
};

export const validatePassword = (identifier, value) => {
  /* Do not allow empty string */
  const constraints = {
      presence: { allowEmpty: false }
  };

  /* If value not empty or undefined, length must be 6-20 chars */
  if (value !== "" && value !== undefined) {
    constraints.length = {
      minimum: 6,
      maximum : 20,
      message: "must be between 6 and 20 characters long ",
    };
  }

  // Validate the value against the constraints
  res = validate(
    { [identifier]: value },
    { [identifier]: constraints  }
  );

  return res && res[identifier];
};

// Validation Constraints for Authentication Forms
export const validateLength = (identifier, value, minL, maxL, allowEmpty) => {
  // Controls whether empty string is allowed
  const constraints = {
        presence: { allowEmpty }
    };

  // If value not empty or undefined, length must be between minL and maxL
  if (!allowEmpty || value !== "") {
    constraints.length = {}
    minL ? constraints.length.minimum = minL : constraints.length.minimum = 0;
    maxL ? constraints.length.maximum = maxL : constraints.length.maximum = 100;
  }

  // Validate the value against the constraints
  res = validate(
    { [identifier]: value },
    { [identifier]: constraints }
  );

  return res && res[identifier];
};
