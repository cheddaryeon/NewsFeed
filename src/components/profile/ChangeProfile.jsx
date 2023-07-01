import uuid from "react-uuid";
import { useState } from 'react';
import { authService, storageService } from "fbase";
import { EmailAuthProvider, updateProfile, updatePassword, reauthenticateWithCredential } from "firebase/auth";
import { setUserInfo } from "redux/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const ChangeProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    newUserName: currentUser.userName,
    currentPw: "",
    newPw: "",
    newPwCheck: "",
    newUserPic: "",
  });
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.userPic);
  const [pwError, setPwError] = useState(false);
  const [pwCheckTxt, setPwCheckTxt] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  console.log("ChangeProfile.jsx 현재 img url state => ", imgFileUrl);

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  
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

  // '파일 선택' img file 변경감지
  const onImgFileChange = (e) => {
    // Uncaught TypeError: Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'. 오류 발생
    const files = e.target?.files;

    // fileReader API
    const theFile = files[0];
    const imgFileReader = new FileReader();
    imgFileReader.onloadend = (finishedEvent) => {
      const { currentTarget: { result }
        , } = finishedEvent;
      setImgFileUrl(result);
    }
    // 4. readAsDataURL API로 사진을 얻는다.
    imgFileReader.readAsDataURL(theFile);
  }

  // x버튼 누르면 이미지 미리보기 -> 다시 현재 프로필 이미지로
  const onClearImgFile = () => setImgFileUrl(currentUser.userPic);

  // 변경된 프로필 사진 등록
  const handleChangeUserPic = async (e) => {
    e.preventDefault();
    let imageUrl = "";
    if (imgFileUrl !== currentUser.userPic) {
      const ok = window.confirm("프로필 이미지를 변경하시겠어요?");
      if (ok) {
        const changedImgRef = ref(storageService, `profile_img/${uuid()}`);
        const response = await uploadString(changedImgRef, imgFileUrl, "data_url");
        imageUrl = await getDownloadURL(response.ref);
      }
      try {
        await updateProfile(authService.currentUser, { photoURL: imageUrl });
        dispatch(
          setUserInfo({
            ...currentUser,
            userPic: imageUrl,
          })
        );
        window.alert("프로필 이미지가 정상적으로 변경되었습니다.");
        setImgFileUrl(imageUrl);
      } catch (error) {
        console.log("Profile img update error => ", error);
        window.alert("프로필 이미지 업데이트에 실패했습니다. 다시 시도해주세요. 🥲");
      }
    } else {
      window.alert("변경할 프로필 이미지를 선택해주세요!");
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
    <ChangeProfileWrapper>
      <MyProfileTitle>My Profile</MyProfileTitle>
      <UserPicPreview src={imgFileUrl} width="150px" height="150px" />
      <ProfileImgForm onSubmit={handleChangeUserPic}>
        <label htmlFor="inUserPic">프로필 사진 변경</label>
        <input
          name="userPic"
          id="inUserPic"
          type="file"
          accept="image/*"
          onChange={onImgFileChange}
        />
        <button onClick={onClearImgFile}>✖️</button>
        {/* 아래 닉네임 변경 input은 button으로 바꾸셔도 됩니다! */}
        <input type="submit" value={"변경된 이미지 등록"} />
      </ProfileImgForm>

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
    </ChangeProfileWrapper>
  );  
}

export default ChangeProfile;

const ChangeProfileWrapper = styled.div`
box-sizing: content-box;
  width: 300px;
  padding: 50px 70px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #c6dfd8;
  
  background-color: #fff;
`

const MyProfileTitle = styled.p`
  margin-bottom: 30px;
  font-size: 32px;
  font-weight: 800;
  letter-spacing: 0.5px;
  color: #1b8d67;
`

const UserPicPreview = styled.img`
  width: 150px;
  height: 150px;
  margin-bottom: 20px;
  border-radius: 50%;
`;

const ProfileImgForm = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 50px;

  & > label {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: 500;
    line-height: 20px;
    letter-spacing: -0.5px;
  }

  & > input {
    font-weight: 400;
    transition: 0.3s;
  }

  & > input:last-of-type {
    margin-top: 10px;
    padding: 5px;
    font-size: 14px;
    font-weight: 400;
    border: 1px solid #999;
    border-radius: 20px;
    box-shadow: 3px 3px 3px #ddd;
    cursor: pointer;
    
    &:hover {
      background-color: #e1e1e1;
    }
  }

  & > button {
    position: absolute;
    top: 50px;
    right: 0px;
    font-size: 10px;
    line-height: 20px;
    border-radius: 3px;
    border: 1px solid #666;
    background-color: #eee;
    transition: 0.2s;
    z-index: 99;

    &:hover {
      background-color: #ddd;
    }
  }
`

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