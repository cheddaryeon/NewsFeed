import { useState } from "react";
import { authService } from "fbase";
import {
  getAuth,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {
      target: { name, value }
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data
      const auth = getAuth();
      data = await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인 데이터 =>", data);
    }
    catch (error) {
      setError(error.message);
    }
    setEmail("");
    setPassword("");
  };

  const onSocialClick = async (event) => {
    const { target: { name } } = event;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      await signInWithPopup(authService, provider);
    }
    catch (error) {
      // switch case로
      console.log("Caught error Popup closed", error);
    }
  }

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

export default Login