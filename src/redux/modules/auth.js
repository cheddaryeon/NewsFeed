const USER_INFO = "USER_INFO";

export const setUserInfo = (user) => ({
  type: USER_INFO,
  payload: user,
});

const initialState = {
  user: null,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case USER_INFO:
      return {
        ...state,
        user: action.payload,
      };

    default:
      return state;
  }
};