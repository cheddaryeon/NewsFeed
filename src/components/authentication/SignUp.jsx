import { authService } from "fbase";
import { setUserInfo, setAuthError } from "redux/modules/auth";
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";

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
        await setPersistence(authService, browserSessionPersistence);
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
    <SignUpWrapper>
      <p>알뜰살뜰 살말에 처음이세요?</p>
      {/* <span>이메일로 가입하기</span> */}
        <SignUpForm onSubmit={onSubmit}>
          <input
            name="email"
            type="email"
            placeholder="이메일 (example@email.com)"
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
        </SignUpForm>
        <button>닫기</button>
    </SignUpWrapper>
  )
}


const SignUpWrapper = styled.div`
  width: 100%;
  padding: 50px 0 30px;
  background-color: #fff;
  box-shadow: 3px 3px 10px #eee;

  & > p {
    margin-bottom: 30px;
    font-size: 18px;
    color: #1a7aa0;
  }

  & > span {
    font-size: 14px;
  }

  & > button {
    width: 100px;
    height: 50px;
    margin-top: 30px;
    background-color: transparent;
  }
`

const SignUpForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 15px auto 0;

  & > input {
    width: 200px;
    height: 30px;
    margin-bottom: 10px;
  }

  & > button {
    margin-top: 5px;
    border-radius: 10px;
    background-color: #eee;
    transition: 0.2s;

    &:hover {
      background-color: #bcbcbc;
    }
  }

  & > input:last-child {
    width: 150px;
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
`

export default SignUp