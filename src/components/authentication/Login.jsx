import { setUserInfo, setAuthError } from "redux/modules/auth";

import { useState } from "react";
import { useDispatch } from "react-redux";

import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const Login = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const auth = getAuth();
      const data = await signInWithEmailAndPassword(auth, email, password);
      dispatch(setUserInfo(data.user));
    } catch (error) {
      setError(error.message);
      dispatch(setAuthError(error.message));
    }
    setEmail("");
    setPassword("");
  };

  const onSocialClick = async (event) => {
    const { name } = event.target;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      const auth = getAuth();
      await signInWithPopup(auth, provider);
      dispatch(setUserInfo(auth));
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
