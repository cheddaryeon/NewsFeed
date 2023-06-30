import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo, setAuthError } from "redux/modules/auth";
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authService } from "fbase";
import { styled } from "styled-components";

const Login = ({handleCloseClick}) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 현재의 세션이나 탭에서만 상태가 유지되며 사용자가 인증된 탭이나 창이 닫히면 삭제 (로그아웃)
      await setPersistence(authService, browserSessionPersistence);
      const { user } = await signInWithEmailAndPassword(authService, email, password);
      dispatch(
        setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        })
      );
    } catch (error) {
      setError(error.message);
      dispatch(setAuthError(error.message));
    }
    setEmail("");
    setPassword("");
  };

  const onSocialClick = async (e) => {
    const { name } = e.target;
    let provider;
    try {
      await setPersistence(authService, browserSessionPersistence);
      provider = new GoogleAuthProvider();
      await signInWithPopup(authService, provider);
      const { user } = await signInWithPopup(authService, email, password);
      dispatch(
        setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        })
      );
    } catch (error) {
      setError("소셜 로그인 중 에러가 발생했습니다.");
      dispatch(setAuthError("소셜 로그인 중 에러가 발생했습니다."));
    }
  };

  return (
    <LoginWrapper>
      <EmailLoginForm onSubmit={onSubmit}>
        <span>이메일로 로그인 하기</span>
        <input
          name="email"
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={"로그인"} />
        {error}
      </EmailLoginForm>
      <GoogleLogin>
        <span>다른 방법으로 로그인하기</span>
        <button onClick={onSocialClick} name="google">
          <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/588px-Google_%22G%22_Logo.svg.png?20230305195327" alt="구글로고" width="auto" height="25px" />
          <span>Continue with Google</span>
        </button>
      </GoogleLogin>
      <button onClick={handleCloseClick}>닫기</button>
    </LoginWrapper>
  );
};

const LoginWrapper = styled.div`
  width: 100%;
  padding: 50px 0 30px;
  margin: 0 auto;
  background-color: #fff;
  box-shadow: 3px 3px 10px #eee;
  text-align: center;

  & > button {
    width: 100px;
    height: 50px;
    margin-top: 30px;
    background-color: transparent;

    &:hover {
      color: #999;
    }
  }
`

const EmailLoginForm = styled.form`
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > span {
    margin-bottom: 10px;
    font-size: 18px;
    color: #1a7aa0;
  }

  & > input {
    width: 200px;
    height: 30px;
  }

  & > input:last-child {
    width: 100px;
    height: 40px;
    margin-top: 10px;

    background-color: #fff;
    color: #333;

    border: 1px solid #eee;
    border-radius: 20px;
    box-shadow: 2px 2px 5px #ddd;

    cursor: pointer;
    transition: 0.3s;

    &:hover {
    background-color: #59afd1;
    color: #ffffff;
    box-shadow: none;
  }
  }

  &::after {
    content: "";
    width: 500px;
    height: 1px;
    margin: 30px 0;
    background-color: #ddd;
  }
`

const GoogleLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  & > span {
    margin: 10px 0;
    font-size: 16px;
    color: #1a7aa0;
  }

  & button {
    display: inline-flex;
    justify-content: center;
    gap: 5px;

    padding: 8px 10px;

    font-size: 14px;
    line-height: 25px;

    border: 1px solid #eee;
    border-radius: 17.5px;
    box-shadow: 2px 2px 5px #ddd;

    transition: 0.3s;

    &:hover {
    background-color: #59afd1;
    color: #ffffff;
    box-shadow: none;
    }
  }
`

export default Login;
