const SET_MY_CONTENTS = "myprofile/SET_MY_CONTENTS";

export const setMyContents = (myContentsArr) => {
  return {
    type: SET_MY_CONTENTS,
    payload: myContentsArr,
  };
};

const initialState = {
  myContents: [],
};

// 리듀서
const myProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MY_CONTENTS:
      return {
        ...state,
        myContents: action.payload,
      };
    default:
      return state;
  }
};

export default myProfileReducer;
