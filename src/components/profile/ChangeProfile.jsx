import uuid from "react-uuid";
import { useState } from 'react';
import { authService, storageService } from "fbase";
import { updateProfile, updatePassword } from "firebase/auth";
import { setUserInfo } from "redux/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

const ChangeProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    newUserName: currentUser.userName,
    newPw: "",
    newPwCheck: "",
    newUserPic: "",
  });
  const [pwError, setPwError] = useState(false);
  const [pwCheckTxt, setPwCheckTxt] = useState("");
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.userPic);

  console.log("ChangeProfile.jsx 현재 img url state => ", imgFileUrl);

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  
    // 비밀번호 유효성 검사
    const { newPw, newPwCheck } = { ...inputs, [name]: value };
  
    if (name === "newPw" && newPwCheck.length > 0) {
      if (newPw !== newPwCheck) {
        setPwCheckTxt("비밀번호와 확인이 일치하지 않습니다.");
        setPwError(true);
      } else {
        setPwCheckTxt("비밀번호와 확인이 일치합니다.");
        setPwError(false);
      }
    } else if (name === "newPwCheck") {
      if (newPw !== newPwCheck) {
        setPwCheckTxt("비밀번호와 확인이 일치하지 않습니다.");
        setPwError(true);
      } else {
        setPwCheckTxt("비밀번호와 확인이 일치합니다.");
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
          window.alert("닉네임이 정상적으로 변경되었습니다.");
        } catch (error) {
          window.alert(error);
          console.log(error);
        }
      }
    } else {
      alert("닉네임 변경사항이 없습니다.");
    }
  };

  // 비밀번호 변경
  const handleChangePw = async (e) => {
    e.preventDefault();
    if (!pwError) {
      try {
        const newPassword = inputs.newPw;
        await updatePassword(authService.currentUser, newPassword);
        window.alert("비밀번호가 정상적으로 변경되었습니다.");
      } catch (error) {
        window.alert(error);
        console.log(error);
      }
    }
  };
  
  return (
    <>
      <h2>My Profile</h2>
      <UserPicPreview src={imgFileUrl} width="150px" height="150px" />
      <form onSubmit={handleChangeUserPic}>
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
        <input type="submit" value={"이미지 변경"} />
      </form>
      <br />
      <label htmlFor="inUserEmail">가입 이메일 주소</label>
      <input
        name="email"
        id="inUserEmail"
        type="text"
        placeholder={currentUser.userEmail ? currentUser.userEmail : "Google 사용자"}
        disabled
      />
      <br />
      <form onSubmit={handleChangeUserName}>
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
        <br />
      </form>
      {authService.currentUser.providerData.some(
        (userInfo) => userInfo.providerId === "google.com"
      ) ? (
        ""
      ) : (
        <>
          <form onSubmit={handleChangePw}>
            <label htmlFor="inNewPw">비밀번호 변경</label>
            <input
              name="newPw"
              id="inNewPw"
              type="password"
              placeholder="변경할 비밀번호 입력"
              value={inputs.newPw}
              onChange={onChange}
            />
            <br />
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
          </form>
          {inputs.newPwCheck && <span>{pwCheckTxt}</span>}
        </>
      )}
    </>
  );  
}

export default ChangeProfile;

const UserPicPreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid lightgray;
`;