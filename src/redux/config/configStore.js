import { createStore } from "redux";
import { combineReducers } from "redux";
import { authReducer } from "redux/modules/auth";
import comments from "redux/modules/comments";
import contents from "redux/modules/contents";

const rootReducer = combineReducers({
  auth: authReducer,
  comments: comments,
  contents: contents,
});

const store = createStore(rootReducer);

export default store;
