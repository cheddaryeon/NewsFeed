import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "redux/modules/auth";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { authService } from "fbase";
import { styled } from "styled-components";

const Login = ({ handleCloseClick }) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
    emailForFindPw: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // firebase error에서 `auth/~` 부분만 추출하는 함수
  const extractErrorCode = (error) => {
    const regex = /\((.*?)\)/;
    const match = error.match(regex);
    const errorText = match ? match[1] : "";
    return errorText;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const { user } = await signInWithEmailAndPassword(
        authService,
        inputs.email,
        inputs.password
      );
      dispatch(
        setUserInfo({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPic: user.photoURL,
        })
      );
    } catch (error) {
      console.log("firebase login error => ", error.message);
      const errorCode = extractErrorCode(error.message);
      switch (errorCode) {
        case "auth/user-not-found":
          setErrorMsg("가입된 이메일이 아닙니다.");
          break;
        case "auth/wrong-password":
          setErrorMsg("이메일과 비밀번호가 일치하지 않습니다.");
          break;
        case "auth/network-request-failed":
          setErrorMsg("네트워크 연결에 실패 하였습니다.");
          break;
        case "auth/invalid-email":
          setErrorMsg("잘못된 이메일 형식입니다.");
          break;
        case "auth/internal-error":
          setErrorMsg("잘못된 요청입니다.");
          break;
        default:
          setErrorMsg("로그인에 실패 하였습니다. 다시 시도해주세요.");
          break;
      }
    }
    setInputs({
      email: "",
      password: "",
    });
  };

  const onFindPasswordClick = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(authService, inputs.emailForFindPw)
      window.alert("✅ 이메일을 확인해주세요!")
    } catch (error) {
      window.alert("🚫 등록되지 않은 이메일입니다.")
    };
    setInputs({
      emailForFindPw: "",
    })
  }

  const onSocialClick = async () => {
    let provider;
    try {
      provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authService, provider);
      // sign in 이후 user 정보를 받아와서 store에 전달
      const { user } = result;
      dispatch(
        setUserInfo({
          userId: user.uid,
          userEmail: user.email,
          userName: user.displayName,
          userPic: user.photoURL,
        })
      );
    } catch (error) {
      setErrorMsg("소셜 로그인 중 에러가 발생했습니다.");
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
          value={inputs.email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={inputs.password}
          onChange={onChange}
        />
        {errorMsg ? <ErrorMsg>{errorMsg}</ErrorMsg> : ""}
        <input type="submit" value={"로그인"} />
      </EmailLoginForm>
      <FindPwForm onSubmit={onFindPasswordClick}>
        <span>비밀번호를 잊으셨나요?</span>
        <input
          name="emailForFindPw"
          type="email"
          placeholder="가입한 E-mail 주소"
          value={inputs.emailForFindPw}
          onChange={onChange}
          required
        />
        <input type="submit" value={"비밀번호 찾기"} />
      </FindPwForm>
      <GoogleLogin>
        <span>다른 방법으로 로그인하기</span>
        <button onClick={onSocialClick} name="google">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/588px-Google_%22G%22_Logo.svg.png?20230305195327"
            alt="구글로고"
            width="auto"
            height="25px"
          />
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
`;

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
    margin-top: 20px;

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
`;

const FindPwForm = styled.form`
  display: flex;
  gap: 10px;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  & > span {
    margin-bottom: 10px;
    font-size: 16px;
    color: #1a7aa0;
  }

  & > input {
    width: 200px;
    height: 30px;
  }

  & > input:last-child {
    width: 100px;
    height: 40px;
    margin-top: 20px;

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
`;

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
`;

const ErrorMsg = styled.p`
  margin-top: 20px;
  color: #c44c4c;
`

export default Login;
