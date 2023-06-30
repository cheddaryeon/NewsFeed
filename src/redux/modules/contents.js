import React from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, dbService } from "fbase";

//action value
const ADD_CONTENTS = "ADD_CONTENTS";
const FETCH_CONTENTS = "FETCH_CONTENTS";
const DELETE_CONTENTS = "DELETE_CONTENTS";
// const UPDATE_CONTENTS = "UPDATE_CONTENTS";

//action creator
export const addContents = (payload) => {
  return { type: ADD_CONTENTS, payload };
};

export const fetchContents = (payload) => {
  return { type: FETCH_CONTENTS, payload };
};

export const deleteContents = (payload) => {
  return { type: DELETE_CONTENTS, payload };
};
// export const updateContents = (payload) => {
//   return { type: UPDATE_CONTENTS, payload };
// };

//초기값
const initialState = [
  {
    wishItemText: "초기값",
    itemPriceText: "초기값",
    wishReasonText: "초기값",
  },
];

//reducer
const contents = (state = initialState, action) => {
  console.log("1. state값 =>", state);

  switch (action.type) {
    case ADD_CONTENTS:
      return [...state, action.payload];

    case FETCH_CONTENTS:
      return action.payload;

    case DELETE_CONTENTS:
      const left_contents_list = state.filter(
        (element) => element.id !== action.payload
      );
      return left_contents_list;

    // case UPDATE_CONTENTS:
    //   //fB document들 중, id가 수정버튼 클릭한 게시물의 id와 일치하는 것만 map으로 return

    //   state.map((element) => {
    //     if (element.id === action.payload.id) {
    //       return [
    //         ...element,
    //         {
    //           itemPriceText: newItemPriceText,
    //           wishItemText: newWishItemText,
    //           wishReasonText: newWishReasonText,
    //         },
    //       ];
    //     } else {
    //       return element;
    //     }
    //   });

    default:
      return state;
  }
};

export default contents;
