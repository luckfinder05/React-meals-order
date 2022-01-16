import { useReducer } from "react";

const initialInputState = {
  value: '',
  isTouched: false
}

const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') { return { ...state, value: action.value } }
  if (action.type === 'BLUR') { return { ...state, isTouched: true } }
  if (action.type === 'RESET') { return { value: '' } }

  return initialInputState;
}

const useInput = (validationFunction) => {
  const [inputState, dispatch] = useReducer(inputStateReducer, initialInputState)
  const enteredTextIsValid = validationFunction(inputState.value);
  const inputHasError = inputState.isTouched && !enteredTextIsValid;

  const onChange = (ev) => { dispatch({ type: 'INPUT', value: ev.target.value }) };
  const onBlur = (ev) => { dispatch({ type: 'BLUR' }) };
  const resetField = () => { dispatch({ type: 'RESET' }) };

  return [{ value: inputState.value, onChange, onBlur }, inputHasError, enteredTextIsValid, resetField]
}

export default useInput;