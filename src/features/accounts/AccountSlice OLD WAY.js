const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return {
        ...state,
        isLoading: false,
        balance: state.balance + action.payload,
      };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      //later
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    case "account/convertCurrency":
      return {
        ...state,
        isLoading: true,
      };
    default:
      return state;
  }
  //ERROR WITH FETCHING URL
}
// export function deposit(amount, currency) {
//   if (currency === "USD") return { type: "account/deposit", payload: amount };

//   return async function (dispatch, getState) {
//     dispatch({ type: "account/convertCurrency" });
//     //api call
//     const res = await fetch(
//       `https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=USD`
//     );
//     const data = await res.json();
//     // Calculate converted amount using the exchange rate
//     const convertedAmount = amount * data.rates.USD;

//     // Dispatch the deposit with converted amount
//     dispatch({ type: "account/deposit", payload: convertedAmount });
//   };
// }

export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  return async function (dispatch, getState) {
    fetch(`https://api.frankfurter.dev/v1/latest?base=${currency}&symbols=USD`)
      .then((resp) => resp.json())
      .then((data) => {
        const convertedAmount = amount * data.rates.USD;
        dispatch({ type: "account/deposit", payload: convertedAmount });
      })
      .catch((error) => {
        console.error("Currency conversion failed:", error);
        // Fallback: deposit original amount if API fails
        dispatch({ type: "account/deposit", payload: amount });
      });
  };
}
export function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}
export function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}
export function payLoan() {
  return { type: "account/payLoan" };
}
