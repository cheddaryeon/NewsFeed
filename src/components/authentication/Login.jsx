import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo } from "redux/modules/auth";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { authService } from "fbase";

const Login = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    password: "",
  })
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
      const { user } = await signInWithEmailAndPassword(authService, email, password);
      dispatch(
        setUserInfo({
          userId: user.uid,
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

  const onSocialClick = async () => {
    let provider;
    try {
      provider = new GoogleAuthProvider();
      await signInWithPopup(authService, provider);
      // sign in 이후 user 정보를 받아와서 store에 전달
      const { user } = await signInWithPopup(authService, email, password);
      dispatch(
        setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        })
      );
    } catch (error) {
      setErrorMsg("소셜 로그인 중 에러가 발생했습니다.")
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
        <input type="submit" value={"로그인"} />
      </form>
      <p>{errorMsg}</p>
      <div>
        <span>다른 방법으로 로그인하기</span>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
      </div>
    </div>
  );
};

export default Login;
