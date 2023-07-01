import Login from "components/authentication/Login";
import SignUp from "components/authentication/SignUp";
import { setUserInfo } from "redux/modules/auth";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { authService } from "fbase";
import { Link, useNavigate } from "react-router-dom";

import { styled } from "styled-components";

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

  const handleCloseClick = () => {
    setShowSignUpForm(false);
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
    <HeaderWrapper>
      {currentUser !== null ? (
        <HeaderInner>
          <HeaderInnerLeftBox>
            <Link to="/">
              <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fpl44k%2FbtslLgoXEsh%2FpUi5OkyfnZUy9pHGJKvW61%2Fimg.png" width="auto" height="40px"/>
            </Link>
            </HeaderInnerLeftBox>
          <HeaderInnerBox>
            <img src="https://firebasestorage.googleapis.com/v0/b/buy-or-not-unlucky7.appspot.com/o/assets%2Fbuyornot_logo.png?alt=media&token=d92ac44f-a857-4f76-a2e2-d9c03c41c371" alt="로고" width="auto" height="80px"/>
          </HeaderInnerBox>
          <HeaderInnerRightBox>
            <UserProfile to={`/profile/${currentUser.userId}`}>
              { currentUser.userPic &&<img src={currentUser.userPic} width="50px" height="50px"/>}
              <UserInfo>
              <UserName to={`/profile/${currentUser.userId}`}>{currentUser.userName}</UserName> 님 환영합니다!
              </UserInfo>
            </UserProfile>
            <Button onClick={handleLogoutClick}>로그아웃</Button>
          </HeaderInnerRightBox>
        </HeaderInner>
      ) : (
        <HeaderInner>
            <HeaderInnerLeftBox>
              <Link to="/">
                <img src="https://img1.daumcdn.net/thumb/R1280x0/?scode=mtistory2&fname=https%3A%2F%2Fblog.kakaocdn.net%2Fdn%2Fpl44k%2FbtslLgoXEsh%2FpUi5OkyfnZUy9pHGJKvW61%2Fimg.png" width="auto" height="40px"/>
              </Link>
            </HeaderInnerLeftBox>
            <HeaderInnerBox>
              <img src="https://firebasestorage.googleapis.com/v0/b/buy-or-not-unlucky7.appspot.com/o/assets%2Fbuyornot_logo.png?alt=media&token=d92ac44f-a857-4f76-a2e2-d9c03c41c371" alt="로고" width="auto" height="80px"/>
              </HeaderInnerBox>
          <HeaderInnerRightBox>
            <Button onClick={handleLoginClick}>로그인</Button>
            <Button onClick={handleSignUpClick}>회원가입</Button>
          </HeaderInnerRightBox>
        </HeaderInner>
      )}
      {currentUser === null && showLoginForm && <Login handleCloseClick={handleCloseClick}/>}
      {currentUser === null && showSignUpForm && <SignUp handleCloseClick={handleCloseClick}/>} 
    </HeaderWrapper>
  );
};

const HeaderWrapper = styled.header`
position: fixed;
  width: 100%;
  min-width: 800px;
  height: 100px;
  margin: 0 auto;
  background-color: #c6ebfa;

  z-index: 999;
`

const HeaderInner = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 100%;
  margin: 0 auto;
`
const HeaderInnerLeftBox = styled.div`
  width: 33.333%;
  text-align: left;
`

const HeaderInnerBox = styled.div`
  width: 33.333%;
`

const HeaderInnerRightBox = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  align-items: center;
  
  width: 33.333%;
`

const Button = styled.button`
  width: 100px;
  height: 36px;

  border-radius: 18px;
  border: none;

  font-weight: 500;

  background-color: white;
  color: #5798c4;

  transition: 0.2s;

  &:hover {
    background-color: #59afd1;
    color: #ffffff;
    box-shadow: none;
  }
`

const UserProfile = styled(Link) `
  display: flex;
  gap: 15px;
  align-items: center;
`

const UserInfo = styled.p`
  font-size: 16px;
  word-break: keep-all;
  line-height: 1.4;
`

const UserName = styled(Link)`
  font-size: 17px;
  font-weight: 500;
  text-decoration: underline;
  transition: 0.2s;
  color: #0e4792;

  &:hover {
    color: #80afce;
  }
`

export default Header;