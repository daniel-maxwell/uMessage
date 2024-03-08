// Reducer function for form state
export const reducerFn = (state, action) => {
  const { validationRes, inputId, inputValue } = action;

  // Update the input field's value
  const updatedInputValues = {
    ...state.values, // state.values
    [inputId]: inputValue
  };

  // Update the input field's valid state
  const updatedInputValidState = {
    ...state.inputValidState,
    [inputId]: validationRes
  };

  let updatedFormValid = true;

  // Check if all form fields are valid
  for (const key in updatedInputValidState) {
    if (updatedInputValidState[key] !== undefined) {
      updatedFormValid = false;
      break;
    }
  }

  // Update the form's valid state
  return {
    values: updatedInputValues,
    inputValidState: updatedInputValidState,
    formValid: updatedFormValid
  };
}