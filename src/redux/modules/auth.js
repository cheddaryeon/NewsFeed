const IS_LOGGEDIN = "IS_LOGGEDIN";

export const setIsLoggedIn = (isLoggedIn) => ({
  type: IS_LOGGEDIN,
  payload: isLoggedIn,
});

const initialState = {
  isLoggedIn: false,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case IS_LOGGEDIN:
      return {
        ...state,
        isLoggedIn: action.payload,
      };

    default:
      return state;
  }
};