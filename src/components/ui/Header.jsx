import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import { setUserInfo } from "redux/modules/auth";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "fbase";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
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

  const handleLogoutClick = () => {
    const confirmLogout = window.confirm("로그아웃 하시겠어요?")
    if (confirmLogout) {
      authService.signOut();
      setShowLoginForm(false);
      setShowSignUpForm(false);
      dispatch(setUserInfo(null));
      navigate("/", { replace: true });
    }
  };

  return (
    <div style={{ border: "solid" }}>
      {currentUser !== null ? (
        <>
          <Link to="/">Home</Link>
          { currentUser.userPic && <img src={currentUser.userPic} alt="프로필 이미지" width="50px" height="50px" /> }
          <Link to={`/profile/${currentUser.userId}`}>{currentUser.userName}</Link>님 환영합니다!
          <button onClick={handleLogoutClick}>로그아웃</button>
        </>
      ) : (
        <>
          <button onClick={handleLoginClick}>로그인</button>
          <button onClick={handleSignUpClick}>회원가입</button>
        </>
      )}
      {currentUser === null && showLoginForm && <Login />}
      {currentUser === null && showSignUpForm && <SignUp />}
    </div>
  );
};

export default Header;
