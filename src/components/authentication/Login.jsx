import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "redux/modules/auth";
import { setPersistence, browserSessionPersistence, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authService } from "fbase";

const Login = () => {
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
        const errorCode = extractErrorCode(error.message);
        let errorMsg = "";

        switch (errorCode) {
          case "auth/user-not-found":
          case "auth/wrong-password":
            errorMsg = "이메일 혹은 비밀번호가 일치하지 않습니다.";
            break;
          case "auth/network-request-failed":
            errorMsg = "네트워크 연결에 실패 하였습니다.";
            break;
          case "auth/invalid-email":
            errorMsg = "잘못된 이메일 형식입니다.";
            break;
          case "auth/internal-error":
            errorMsg = "잘못된 요청입니다.";
            break;
          default:
            errorMsg = "로그인에 실패 하였습니다.";
            break;
        }
        alert(errorMsg);
      }
    setEmail("");
    setPassword("");
  };

  const onSocialClick = async () => {
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
    }
  };

  return (
    <div>
      <h2>이메일로 로그인 하기</h2>
      <form onSubmit={onSubmit}>
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
      </form>
      <div>
        <span>다른 방법으로 로그인하기</span>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
      </div>
    </div>
  );
};

export default Login;
