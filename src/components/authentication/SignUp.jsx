import { authService } from "fbase";
import { setUserInfo } from "redux/modules/auth";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { styled } from "styled-components";

const SignUp = ({handleCloseClick}) => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    userName: "",
    pw: "",
    pwCheck: "",
  });
  const [pwError, setPwError] = useState(false);
  const [pwCheckTxt, setPwCheckTxt] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  
    // 비밀번호 유효성 검사
    const { pw, pwCheck } = { ...inputs, [name]: value };
  
    if (name === "pw" && pwCheck.length > 0) {
      if (pw !== pwCheck) {
        setPwCheckTxt("비밀번호와 확인이 일치하지 않습니다.");
        setPwError(true);
      } else {
        setPwCheckTxt("비밀번호와 확인이 일치합니다.");
        setPwError(false);
      }
    } else if (name === "pwCheck") {
      if (pw !== pwCheck) {
        setPwCheckTxt("비밀번호와 확인이 일치하지 않습니다.");
        setPwError(true);
      } else {
        setPwCheckTxt("비밀번호와 확인이 일치합니다.");
        setPwError(false);
      }
    }
    setErrorMsg("");
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
    if (!pwError) {
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
      } catch (error) {
        const errorCode = extractErrorCode(error.message);
        switch (errorCode) {
          case "auth/email-already-in-use":
            setErrorMsg("이미 사용 중인 이메일입니다.");
            break;
          case "auth/weak-password":
            setErrorMsg("비밀번호는 6글자 이상이어야 합니다.");
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
            setErrorMsg("회원가입에 실패 하였습니다. 다시 시도해주세요.");
            break;
        }
      }
    };
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
          <p>{inputs.pwCheck && pwCheckTxt}</p>
          <p>{errorMsg}</p>
          <input type="submit" value={"회원가입"} />
        </SignUpForm>
        <button onClick={handleCloseClick}>닫기</button>
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
    
    &:hover {
      color: #999;
    }
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