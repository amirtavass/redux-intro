import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./features/accounts/AccountSlice";
import customerReducer from "./features/customers/CustomerSlice";

//OLD WAY
// const rootReducer = combineReducers({
//   account: accountReducer,
//   customer: customerReducer,
// });
// const store = createStore(
//   rootReducer,
//   composeWithDevTools(applyMiddleware(thunk))
// );

//NEW WAY
const store = configureStore({
  reducer: { account: accountReducer, customer: customerReducer },
});
export default store;
