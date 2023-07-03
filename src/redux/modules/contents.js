//action value
const ADD_CONTENTS = "ADD_CONTENTS";
const FETCH_CONTENTS = "FETCH_CONTENTS";
const DELETE_CONTENTS = "DELETE_CONTENTS";

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
  // useEffect(() => {
  //   console.log("1. state값 =>", state);
  // }, [])
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

    default:
      return state;
  }
};

export default contents;
