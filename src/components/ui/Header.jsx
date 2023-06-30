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
            <img src="https://file.notion.so/f/s/55e329af-aa06-4182-b826-c60d525f80eb/_%E1%84%82%E1%85%B2%E1%84%89%E1%85%B3%E1%84%91%E1%85%B5%E1%84%83%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3_%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-001_(1).png?id=84e41d7b-8d50-45e5-a07a-e4d8b6ad5768&table=block&spaceId=2d189cca-e623-443e-92bd-24c667dbde73&expirationTimestamp=1688112000000&signature=mD7vyCk-y7LMQmoQKbVijuDbrlv7FvxM5_c9XBjuH0I&downloadName=_%E1%84%82%E1%85%B2%E1%84%89%E1%85%B3%E1%84%91%E1%85%B5%E1%84%83%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3+%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-001+%281%29.png" alt="로고" width="auto" height="80px"/>
          </HeaderInnerBox>
          <HeaderInnerRightBox>
            <UserProfile to={`/profile/${currentUser.userId}`}>
              { currentUser.userPic &&<img src={currentUser.userPic} width="50px" height="50px"/>}
              <Link to={`/profile/${currentUser.userId}`}>{currentUser.userName}</Link>님 환영합니다!
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
              <img src="https://file.notion.so/f/s/55e329af-aa06-4182-b826-c60d525f80eb/_%E1%84%82%E1%85%B2%E1%84%89%E1%85%B3%E1%84%91%E1%85%B5%E1%84%83%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3_%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-001_(1).png?id=84e41d7b-8d50-45e5-a07a-e4d8b6ad5768&table=block&spaceId=2d189cca-e623-443e-92bd-24c667dbde73&expirationTimestamp=1688112000000&signature=mD7vyCk-y7LMQmoQKbVijuDbrlv7FvxM5_c9XBjuH0I&downloadName=_%E1%84%82%E1%85%B2%E1%84%89%E1%85%B3%E1%84%91%E1%85%B5%E1%84%83%E1%85%B3%E1%84%91%E1%85%B3%E1%84%85%E1%85%A9%E1%84%8C%E1%85%A6%E1%86%A8%E1%84%90%E1%85%B3+%E1%84%85%E1%85%A9%E1%84%80%E1%85%A9-001+%281%29.png" alt="로고" width="auto" height="80px"/>
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

export default Header;
