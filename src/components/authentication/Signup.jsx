import { useState } from "react";
import { authService } from "fbase";
import {
  getAuth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

const SignUp = () => {
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
      data = await createUserWithEmailAndPassword(auth, email, password);
      console.log("로그인 정보", data);
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
      console.log("Caught error Popup closed", error);
    }
  }

  return (
    <div>
      <h2>알뜰살뜰 살말에 처음이세요?</h2>
      <span>이메일로 가입하기</span>
      <form onSubmit={onSubmit}>
        <input name="email"
          type="email"
          placeholder="E-mail"
          required
          value={email}
          onChange={onChange}
        />
        <input name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={"회원가입"} />
        {error}
      </form>
      <div>
        <span>다른 방법으로 가입하기</span>
        <button onClick={onSocialClick} name="google">Continue with Google</button>
      </div>
    </div>
  );
};

export default SignUp;