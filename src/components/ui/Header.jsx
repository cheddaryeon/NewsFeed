import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import { setIsLoggedIn } from "redux/modules/auth";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAuth, signOut } from "firebase/auth";

const Header = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showSignUpForm, setShowSignUpForm] = useState(false);

  const handleLoginClick = () => {
    setShowLoginForm(true);
    setShowSignUpForm(false);
  }

  const handleSignUpClick = () => {
    setShowSignUpForm(true);
    setShowLoginForm(false);
  }

  const auth = getAuth();
  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠어요?")
    if (confirmLogout) {
      signOut(auth);
      dispatch(setIsLoggedIn(false));
    }
  };

  return (
    <div style={{ border: "solid" }}>
      {isLoggedIn ? (
        <button onClick={handleLogoutClick}>로그아웃</button>
      ) : (
        <>
          <button onClick={handleLoginClick}>로그인</button>
          <button onClick={handleSignUpClick}>회원가입</button>
        </>
      )}
      {!isLoggedIn && showLoginForm && <Login />}
      {!isLoggedIn && showSignUpForm && <SignUp />}
    </div>
  );
};

export default Header;
