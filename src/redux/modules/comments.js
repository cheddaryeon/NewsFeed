import { element } from "prop-types";
import React from "react";

//action value
const ADD_COMMENTS = "ADD_COMMENTS";
const DELETE_COMMENTS = "DELETE_COMMENTS";
// const FETCH_COMMENTS = "FETCH_COMMENTS";
//cosnt UPDATE_COMMENTS = ""UPDATE_COMMENTS";

//action creator
export const addcomments = (payload) => {
  return { type: ADD_COMMENTS, payload };
};
export const deleteComments = (payload) => {
  return { type: DELETE_COMMENTS, payload };
};
// export const fetchComments = (payload) => {
//   return { type: FETCH_COMMENTS, payload };
// };
// export const updateComments = (payload) => {
//   return { type: UPDATE_COMMENTS, payload };
// };

const initialState = [
  {
    commentsOpinion: "초기값",
    commentsBody: "초기값",
  },
];

//reducer
const comments = (state = initialState, action) => {
  switch (action.type) {
    case ADD_COMMENTS:
      return [...state, action.payload];

    case DELETE_COMMENTS:
      const left_comments_list = state.filter(
        (element) => element.id !== action.payload
      );
      return left_comments_list;

    // case FETCH_COMMENTS:
    //   return action.payload;

    default:
      return state;
  }
};

export default comments;
