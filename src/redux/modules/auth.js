const USER_INFO = "USER_INFO";
const AUTH_ERROR = "AUTH_ERROR";

export const setUserInfo = (user) => ({
  type: USER_INFO,
  payload: user,
});

export const setAuthError = (error) => ({
  type: AUTH_ERROR,
  payload: error,
});

const initialState = {
  user: null,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case USER_INFO:
      return {
        ...state,
        user: action.payload,
      };

    case AUTH_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
