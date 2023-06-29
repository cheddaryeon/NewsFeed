import React from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, dbService } from "fbase";

//action value
const ADD_CONTENTS = "ADD_CONTENTS";
const FETCH_CONTENTS = "FETCH_CONTENTS";

//action creator
export const addContents = (payload) => {
  return { type: ADD_CONTENTS, payload };
};

export const fetchContents = (contents_list) => {
  return { type: FETCH_CONTENTS, contents_list };
};

//초기값
const initialState = [
  {
    wishItemText: "아이패드",
    itemPriceText: "600000",
    wishReasonText: "유튜브 언박싱 영상 보다가 아이패드병 걸림",
  },
];

//reducer
const contents = (state = initialState, action) => {
  // console.log("state값", state);

  switch (action.type) {
    case ADD_CONTENTS:
      addDoc(collection(dbService, "contents"), action.payload); //이렇게만 하면, promise객체만 반환
      return [...state, action.payload];

    case FETCH_CONTENTS:
      return action.contents_list;

    default:
      return state;
  }
};

export default contents;
