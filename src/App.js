import { useReducer } from "react";
import "./styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const actions = {
  ADD_DIGIT: "add-digit",
  CHOOSE_OPERATION: "choose-operation",
  ALL_CLEAR: "all_clear",
  DELETE: "delete",
  EVAL: "eval",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case actions.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      }
      if (payload.digit === "0" && state.currentOperand === "0") return state;

      if (
        payload.digit === "." &&
        (state.currentOperand == null ||
          state.currentOperand === "" ||
          state.currentOperand.includes("."))
      )
        return state;

      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };

    case actions.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null)
        return state;

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation,
        };
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }

      return {
        ...state,
        operation: payload.operation,
        previousOperand: evaluate(state),
        currentOperand: null,
      };

    case actions.ALL_CLEAR:
      return {};

    case actions.DELETE:
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };

      if (state.overwrite)
        return {
          ...state,
          currentOperand: null,
        };

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case actions.EVAL:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      )
        return state;

      return {
        overwrite: true,
        previousOperand: null,
        currentOperand: evaluate(state),
        operation: null,
      };
  }
}

function evaluate({ currentOperand, previousOperand, operation }) {
  const current = parseFloat(currentOperand);
  const previous = parseFloat(previousOperand);

  if (isNaN(current) || isNaN(previous)) return "";

  switch (operation) {
    case "+":
      return (previous + current).toString();
    case "–":
      return (previous - current).toString();
    case "×":
      return (previous * current).toString();
    case "÷":
      return (previous / current).toString();
    default:
      return;
  }
}

const INT_FORMATTER = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

function formatNumber(number) {
  if (number == null) return "";
  const [integer, decimal] = number.split(".");
  if (decimal == null) return INT_FORMATTER.format(integer);
  return `${INT_FORMATTER.format(integer)}.${decimal}`;
}

function App() {
  const [{ currentOperand, previousOperand, operation }, dispatch] = useReducer(
    reducer,
    {currentOperand: "0"}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatNumber(previousOperand)} {operation}
        </div>
        <div className="current-operand">{formatNumber(currentOperand)}</div>
      </div>

      <button
        className="span-two"
        onClick={() => dispatch({ type: actions.ALL_CLEAR })}
      >
        AC
      </button>

      <button onClick={() => dispatch({ type: actions.DELETE })}>DEL</button>
      <OperationButton operation="÷" dispatch={dispatch} />
      <DigitButton digit="7" dispatch={dispatch} />
      <DigitButton digit="8" dispatch={dispatch} />
      <DigitButton digit="9" dispatch={dispatch} />
      <OperationButton operation="×" dispatch={dispatch} />
      <DigitButton digit="4" dispatch={dispatch} />
      <DigitButton digit="5" dispatch={dispatch} />
      <DigitButton digit="6" dispatch={dispatch} />
      <OperationButton operation="+" dispatch={dispatch} />
      <DigitButton digit="1" dispatch={dispatch} />
      <DigitButton digit="2" dispatch={dispatch} />
      <DigitButton digit="3" dispatch={dispatch} />
      <OperationButton operation="–" dispatch={dispatch} />
      <DigitButton digit="." dispatch={dispatch} />
      <DigitButton digit="0" dispatch={dispatch} />
      <button
        className="span-two"
        onClick={() => dispatch({ type: actions.EVAL })}
      >
        =
      </button>
    </div>
  );
}

export default App;
