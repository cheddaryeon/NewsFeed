import { createStore } from "redux";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  // reducers
});

const store = createStore(rootReducer);

export default store;