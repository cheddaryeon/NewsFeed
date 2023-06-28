import { getAuth, onAuthStateChanged } from "firebase/auth";
import { setIsLoggedIn } from "redux/modules/auth";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Router from "shared/Router";
import GlobalStyle from "GlobalStyle";

import app from "fbase"; // Firebase 앱 초기화 코드를 추가하세요.

const App = () => {
  const dispatch = useDispatch();

  // firebase 초기화 여부
  const [init, setInit] = useState(false);
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
      setInit(true);
    });
  }, [dispatch]);

  return (
    <>
      <GlobalStyle />
      {/* {firebase가 초기화 되는데 시간이 걸려서, 초기화 되기 전이면 "로딩 중" 멘트 출력} */}
      {init ? <Router isLoggedIn={Boolean(userInfo)} userInfo={userInfo} /> : "로딩 중.."}
    </>
  );
};

export default App;