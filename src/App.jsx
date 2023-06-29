import { authService } from "fbase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { setUserInfo } from "redux/modules/auth";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Router from "shared/Router";
import GlobalStyle from "GlobalStyle";

const App = () => {
  const dispatch = useDispatch();

  // firebase 초기화 여부
  const [init, setInit] = useState(false);

  useEffect(() => {
    onAuthStateChanged(authService, (currentUser) => {
      if (currentUser) {
        const userInfo = {
          userId: currentUser.uid,
          userName: currentUser.displayName,
          userPic: currentUser.photoURL,
          updateProfile: (args) => updateProfile(currentUser, args),
        };
        dispatch(setUserInfo(userInfo));
      } else {
        dispatch(setUserInfo(null));
      }
      setInit(true);
    });
  },[dispatch]);

  console.log("fb 서버에서 받아온 현재 사용자 데이터 => ", authService.currentUser)
  console.log("App.jsx console.log store에 저장해 둔 현재 사용자 데이터", useSelector((state)=>state.auth.user))

  return (
    <>
      <GlobalStyle />
      {/* {firebase가 초기화 되는데 시간이 걸려서, 초기화 되기 전이면 "로딩 중" 멘트 출력} */}
      {init ? <Router /> : "로딩 중.."}
    </>
  );
};

export default App;
