import { authService } from "fbase";
import { setUserInfo } from "redux/modules/auth";
import { setPersistence, browserSessionPersistence, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useDispatch, useSelector} from "react-redux";

const SignUp = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    email: "",
    userName: "",
    pw: "",
    pwCheck: "",
  });
  const [pwError, setPwError] = useState(false);
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
        setPwError(true);
      } else {
        setErrorCheck("비밀번호와 확인이 일치합니다.");
        setPwError(false);
      }
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
    if (!pwError) {
      try {
        const { email, pw, userName } = inputs;
        const { user } = await createUserWithEmailAndPassword(authService, email, pw);
        await updateProfile(user, {
          displayName: userName,
          photoURL: "https://firebasestorage.googleapis.com/v0/b/buy-or-not-unlucky7.appspot.com/o/assets%2Fbasic_profile.jpg?alt=media&token=cbace50c-1d86-4a61-8430-713db79cef58",
        });
        await setPersistence(authService, browserSessionPersistence);
        setInputs({
          email: "",
          userName: "",
          pw: "",
          pwCheck: "",
        });
        dispatch(setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        }))
      } catch (error) {
        const errorCode = extractErrorCode(error.message);
        let errorMsg = "";

        switch (errorCode) {
          case "auth/email-already-in-use":
            errorMsg = "이미 사용 중인 이메일입니다.";
            break;
          case "auth/weak-password":
            errorMsg = "비밀번호는 6글자 이상이어야 합니다.";
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
            errorMsg = "회원가입에 실패 하였습니다.";
            break;
        }
        alert(errorMsg);
      }
    };
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