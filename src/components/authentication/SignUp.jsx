import { authService } from "fbase";
import { setUserInfo, setAuthError } from "redux/modules/auth";
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    userName: "",
    pw: "",
    pwCheck: "",
  });
  const [error, setError] = useState(false);
  const [errorCheck, setErrorCheck] = useState("");

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // 비밀번호 유효성검사
    const { pw } = inputs;
    if (name === "pwCheck") {
      if (pw !== value) {
        setErrorCheck("비밀번호와 확인이 일치하지 않습니다.")
        setError(true);
      } else {
        setErrorCheck("비밀번호와 확인이 일치합니다.");
        setError(false)
      }
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("SignUp.jsx 로그인 에러 상태", error);
    if (!error) {
      try {
        const { email, pw, userName } = inputs;
        const { user } = await createUserWithEmailAndPassword(authService, email, pw);
        await updateProfile(user, {
          displayName: userName,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/buy-or-not-unlucky7.appspot.com/o/assets%2Fbasic_profile.jpg?alt=media&token=cbace50c-1d86-4a61-8430-713db79cef58",
        });
        dispatch(setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        }))
        setInputs({
          email: "",
          userName: "",
          pw: "",
          pwCheck: "",
        });
      } catch (error) {
        setError(error.message);
        alert(error);
      }
      setError(false)
    }
  };

  return (
    <>
      <h2>알뜰살뜰 살말에 처음이세요?</h2>
        <span>이메일로 가입하기</span>
        <form onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="example@email.com"
            required
            value={inputs.email}
            onChange={onChange}
          />
          <button>중복 확인</button>
          <br />
          <input
            name="userName"
            type="text"
            placeholder="닉네임 입력"
            required
            value={inputs.userName}
            onChange={onChange}
          />
          <br />
          <input
            name="pw"
            type="password"
            placeholder="비밀번호 설정"
            required
            value={inputs.pw}
            onChange={onChange}
          />
          <br />
          <input
            name="pwCheck"
            type="password"
            placeholder="비밀번호 확인"
            required
            value={inputs.pwCheck}
            onChange={onChange}
          />
          <br />
          <p>{inputs.pwCheck && errorCheck}</p>
          <input type="submit" value={"회원가입"} />
        </form>
    </>
  )
}

export default SignUp