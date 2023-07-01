import { createStore } from "redux";
import { combineReducers } from "redux";
import { auth } from "redux/modules/auth";
import comments from "redux/modules/comments";
import contents from "redux/modules/contents";
import myProfileReducer from "redux/modules/myprofile";

const rootReducer = combineReducers({
  auth,
  comments: comments,
  contents: contents,
  myprofile: myProfileReducer,
});

const store = createStore(rootReducer);

export default store;