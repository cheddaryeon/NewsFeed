import { useState } from 'react';

import { authService } from "fbase";
import { EmailAuthProvider, updateProfile, updatePassword, reauthenticateWithCredential } from "firebase/auth";

import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "redux/modules/auth";

import { styled } from "styled-components";

const ChangeUserNameAndPw = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => (state.auth.user))
  const [inputs, setInputs] = useState({
    newUserName: currentUser.userName,
    currentPw: "",
    newPw: "",
    newPwCheck: "",
  });
  const [pwError, setPwError] = useState(false);
  const [pwCheckTxt, setPwCheckTxt] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }))
  
    // 변경 비밀번호 유효성 검사
    const { newPw, newPwCheck } = { ...inputs, [name]: value };
  
    if (name === "newPw" && newPwCheck.length > 0) {
      if (newPw !== newPwCheck) {
        setPwCheckTxt(`변경할 비밀번호와 확인이 일치하지 않습니다.`);
        setPwError(true);
      } else {
        setPwCheckTxt(`변경할 비밀번호와 확인이 일치합니다.`);
        setPwError(false);
      }
    } else if (name === "newPwCheck") {
      if (newPw !== newPwCheck) {
        setPwCheckTxt(`변경할 비밀번호와 확인이 일치하지 않습니다.`);
        setPwError(true);
      } else {
        setPwCheckTxt(`변경할 비밀번호와 확인이 일치합니다.`);
        setPwError(false);
      }
    }
  };

    // 닉네임 변경
    const handleChangeUserName = async (e) => {
      e.preventDefault();
      const { newUserName } = inputs;
      if (newUserName !== currentUser.userName) {
        const ok = window.confirm(`닉네임을 '${newUserName}'으로 변경하시겠어요?`);
        if (ok) {
          try {
            await updateProfile(authService.currentUser, { displayName: newUserName });
            dispatch(
              setUserInfo({
                ...currentUser,
                userName: newUserName,
              })
            );
            window.alert(`닉네임이 정상적으로 변경되었습니다.`);
          } catch (error) {
            window.alert(error);
            console.log(error);
          }
        }
      } else {
        alert(`닉네임 변경사항이 없습니다.`);
      }
    };
  
    // firebase error에서 `auth/~` 부분만 추출하는 함수
    const extractErrorCode = (error) => {
      const regex = /\((.*?)\)/;
      const match = error.match(regex);
      const errorText = match ? match[1] : "";
      return errorText;
    }; 
  
    // 비밀번호 변경
    const handleChangePw = async (e) => {
      e.preventDefault();
      const currentEmail = currentUser.userEmail;
      const currentPassword = inputs.currentPw;
      const newPassword = inputs.newPw;
      if (!pwError && currentPassword !== newPassword) {
        try {
          // 사용자 재인증
          const credential = EmailAuthProvider.credential(currentEmail, currentPassword);
          await reauthenticateWithCredential(authService.currentUser, credential);
  
          // 비밀번호 업데이트
          await updatePassword(authService.currentUser, newPassword);
  
          window.alert("비밀번호가 정상적으로 변경되었습니다.");
  
        } catch (error) {
          const errorCode = extractErrorCode(error.message);
          console.log("firebase login error => ", errorCode);
          switch (errorCode) {
            case "auth/invalid-credential":
              setErrorMsg("비밀번호 변경에 실패하였습니다. 다시 시도해주세요.");
              break;
            case "auth/wrong-password":
              setErrorMsg("현재 비밀번호가 일치하지 않습니다.");
              break;
            case "auth/too-many-requests":
              setErrorMsg("변경 시도 횟수가 초과하였습니다. 잠시 후 다시 시도해주세요.");
              break;
            default:
              setErrorMsg("비밀번호 변경에 실패했습니다. 다시 시도해주세요.");
              break;
          }
          window.alert(errorMsg);
        }
      } else if (currentPassword === newPassword) {
        window.alert("현재 비밀번호와 변경된 비밀번호가 같습니다. 비밀번호를 새로 변경해주세요!")
      }
    };

  return (
    <>
      <EmailForm>
        <label htmlFor="inUserEmail">가입 이메일 주소</label>
        <input
          name="email"
          id="inUserEmail"
          type="text"
          placeholder={currentUser.userEmail ? currentUser.userEmail : "Google 사용자"}
          disabled
        />
      </EmailForm>

      <UserNameForm onSubmit={handleChangeUserName}>
        <label htmlFor="inUserName">닉네임</label>
        <input
          name="newUserName"
          id="inUserName"
          type="text"
          placeholder={currentUser.userName}
          value={inputs.newUserName}
          onChange={onChange}
        />
        {/* 아래 닉네임 변경 input은 button으로 바꾸셔도 됩니다! */}
        <input type="submit" value={"닉네임 변경"} />
      </UserNameForm>
      {authService.currentUser.providerData.some(
        (userInfo) => userInfo.providerId === "google.com"
      ) ? (
        ""
      ) : (
        <>
          <PassWordFrom onSubmit={handleChangePw}>
            <label htmlFor="inPw">현재 비밀번호</label>
            <input
              name="currentPw"
              id="inPw"
              type="password"
              placeholder="현재 비밀번호 입력"
              value={inputs.currentPw}
              onChange={onChange}
            />
            <label htmlFor="inNewPw">비밀번호 변경</label>
            <input
              name="newPw"
              id="inNewPw"
              type="password"
              placeholder="변경할 비밀번호 입력"
              value={inputs.newPw}
              onChange={onChange}
            />
            <label htmlFor="inNewPwCheck">비밀번호 변경 확인</label>
            <input
              name="newPwCheck"
              id="inNewPwCheck"
              type="password"
              placeholder="변경할 비밀번호 확인"
              value={inputs.newPwCheck}
              onChange={onChange}
              />
            {/* 아래 닉네임 변경 input은 button으로 바꾸셔도 됩니다! */}
            <input type="submit" value={"비밀번호 변경"} />
          </PassWordFrom>
          {inputs.newPwCheck && <span>{pwCheckTxt}</span>}
        </>
      )}
    </>
  )
}

export default ChangeUserNameAndPw;

const EmailForm = styled.div`
  margin-bottom: 50px;

  & > label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.5px;
  }

  & > input {
    width: 100%;
    margin-top: 15px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #999;
  }
`

const UserNameForm  = styled.form`
  display: flex;
  flex-direction: column;

  & > label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.5px;
  }

  & > input {
    width: 100%;
    margin-top: 15px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #999;
  }

  & > input:last-of-type {
    width: 120px;
    margin: 15px auto 0;
    cursor: pointer;
    box-shadow: 3px 3px 3px #ddd;
  }
`

const PassWordFrom = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 50px;

  & > label {
    display: block;
    font-size: 16px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.5px;
  }

  & > input {
    width: 100%;
    margin: 15px auto 20px;
    padding: 5px 10px;
    border-radius: 20px;
    border: 1px solid #999;
  }

  & > input:last-of-type {
    width: 120px;
    cursor: pointer;
    box-shadow: 3px 3px 3px #ddd;
  }
`