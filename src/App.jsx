import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setIsLoggedIn } from "redux/modules/auth";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "shared/Router";
import GlobalStyle from "GlobalStyle";

import app from "fbase"; // Firebase 앱 초기화 코드를 추가하세요.

const App = () => {
  const dispatch = useDispatch();
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const auth = getAuth(app);
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          updateProfile: (args) => user.updateProfile(args),
        });
        dispatch(setIsLoggedIn(true));
      } else {
        setUserInfo(null);
        dispatch(setIsLoggedIn(false));
      }
    });
  }, []);

  return (
    <>
      <GlobalStyle />
      <Router isLoggedIn={Boolean(userInfo)} userInfo={userInfo} />
    </>
  );
};

export default App;