import { addDoc, collection } from "firebase/firestore";
import { dbService } from "fbase";

//action value
const ADD_COMMENT = "ADD_COMMENT";

//action creator
export const addComment = (payload) => {
  return { type: ADD_COMMENT, payload };
};

//초기값
const initialState = [
  {
    commentsBody: "(데이터 아님)가격이 합리적인 것 같음.",
  },
];

//reducer
const comments = (state = initialState, action) => {
  // console.log("state값", state);

  switch (action.type) {
    case ADD_COMMENT:
      addDoc(collection(dbService, "comments"), action.payload); //이렇게만 하면, promise객체만 반환
      return [...state, action.payload]

    default:
      return state;
  }
};

export default comments;