import { useState } from 'react';
import { useSelector } from "react-redux";

console.log()

const MyProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    userName: "",
    pw: "",
    pwCheck: "",
    userPic: "",
  })
  const [error, setError] = useState(false);
  const [errorCheck, setErrorCheck] = useState("");
  
  // console.log("MyProfile.jsx => ", newProfileData);

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
    console.log("MyProfile.jsx 에러 상태", error);
    // 닉네임 변경
    if (!error) {
      try {
        const { photoURL, userName, pw, pwCheck } = inputs;
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
  }
  
  return (
    <>
      <h2>My Profile</h2>
      <img src={currentUser.userPic} width="150px" height="150px" />
      <form>
        <label></label>
        <input
         name="userPic"
        />
      </form>
      <br />
      <label htmlFor="inUserEmail">
        가입 이메일 주소
      </label>
      <input
        name="email"
        id="inUserEmail"
        type="text"
        value={currentUser.email ? currentUser.email : ""}
        disabled
      />
      <br />
      <form name="changeUserNameForm" onSubmit={onSubmit}>
        <label htmlFor="inUserName">
          닉네임
        </label>
        <input
          name="userName"
          id="inUserName"
          type="text"
          value={currentUser.userName}
          onChange={onChange}
        />
        <button type="submit">변경</button>
      </form>
      <form name="changePwForm" onSubmit={onSubmit}>
        <label htmlFor="inPw">
          비밀번호 변경
        </label>
        <input
          name="pw"
          id="inPw"
          type="password"
          placeholder="변경할 비밀번호를 입력하세요."
          required
          value={inputs.pw}
          onChange={onChange}
        />
          <br />
        <label htmlFor="inPwCheck">
          비밀번호 변경 확인
        </label>
        <input
          name="pw"
          id="inPwCheck"
          type="password"
          placeholder="변경할 비밀번호를 입력하세요."
          required
          value={inputs.pw}
          onChange={onChange}
        />
          <br />
          <p>{inputs.pwCheck && errorCheck}</p>
          <input type="submit" value={"프로필 변경"} />
        </form>
      <br />
    </>
  )
}

export default MyProfile;