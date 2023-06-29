import { useState } from "react";
import { useDispatch } from "react-redux";
import { setUserInfo, setAuthError } from "redux/modules/auth";
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

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      // 현재의 세션이나 탭에서만 상태가 유지되며 사용자가 인증된 탭이나 창이 닫히면 삭제 (로그아웃)
      await setPersistence(authService, browserSessionPersistence);
      const data = await signInWithEmailAndPassword(authService, email, password);
      // dispatch -> 로그인이 되자마자 프로필 이미지와 닉네임이 바로 반영되도록
      dispatch(setUserInfo({
        userId: data.user.uid,
        userName: data.user.displayName,
        userPic: data.user.photoURL,
      }))
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
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      await signInWithPopup(authService, provider);
      dispatch(setUserInfo(authService));
    } catch (error) {
      setError("소셜 로그인 중 에러가 발생했습니다.");
      dispatch(setAuthError("소셜 로그인 중 에러가 발생했습니다."));
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
