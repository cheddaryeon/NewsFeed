import { createRef, useState } from 'react';
import { authService } from "fbase";
import { updateProfile, updatePassword } from "firebase/auth";
import { setUserInfo } from "redux/modules/auth";
import { useDispatch, useSelector } from "react-redux";
import { styled } from "styled-components";

const ChangeProfile = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    newUserName: currentUser.userName,
    newPw: "",
    newPwCheck: "",
    newUserPic: "",
  })
  const [pwError, setPwError] = useState(false);
  const [pwCheckTxt, setPwCheckTxt] = useState("");
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.userPic);

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
  

  const onImgFileChange = (e) => {
    const files = e.target?.files;
  
    if (files && files.length > 0) {
      const theFile = files[0];
      const imgFileReader = new FileReader();
  
      imgFileReader.onloadend = (finishedEvent) => {
        const { currentTarget: { result } } = finishedEvent;
        setImgFileUrl(result);
      };
  
      imgFileReader.readAsDataURL(theFile);
    } else {
      setImgFileUrl(currentUser.userPic);
    }

    // 이미지 firebase storage에 업데이트
  };  

  const onClearImgFile = () => setImgFileUrl(currentUser.userPic);

    // 프로필 사진 변경
  const handleChangeUserPic = async (e) => {
    e.preventDefault();
  }

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
        <label htmlFor="inUserPic">
          프로필 사진 변경
        </label>
        <input
          name="userPic"
          id="inUserPic"
          type="file"
          accept="image/*"
          onChange={onImgFileChange}
        />
        <button onClick={onClearImgFile}>✖️</button>
      </form>
      <br />
      <label htmlFor="inUserEmail">
        가입 이메일 주소
      </label>
        <input
          name="email"
          id="inUserEmail"
          type="text"
          placeholder={currentUser.userEmail ? currentUser.userEmail : "Google 사용자"}
          disabled
        />
      <br />
      <form onSubmit={handleChangeUserName}>
        <label htmlFor="inUserName">
          닉네임
        </label>
        <input
          name="newUserName"
          id="inUserName"
          type="text"
          placeholder={currentUser.userName}
          value={inputs.newUserName}
          onChange={onChange}
        />
        <input type="submit" value={"닉네임 변경"} />
        <br />
      </form>
      <form onSubmit={handleChangePw}>
        <label htmlFor="inNewPw">
          비밀번호 변경
        </label>
        <input
          name="newPw"
          id="inNewPw"
          type="password"
          placeholder={currentUser.userEmail ? "변경할 비밀번호" : "Google 사용자는 비밀번호 설정 불가"}
          value={inputs.newPw}
          onChange={onChange}
          disabled={!currentUser.userEmail}
        />
        <br />
        <label htmlFor="inNewPwCheck">
          비밀번호 변경 확인
        </label>
        <input
          name="newPwCheck"
          id="inNewPwCheck"
          type="password"
          placeholder={currentUser.userEmail ? "변경할 비밀번호 확인" : ""}
          value={inputs.newPwCheck}
          onChange={onChange}
          disabled={!currentUser.userEmail}
        />
        {currentUser.userEmail ? <input type="submit" value={"비밀번호 변경"} /> : ""}
      </form>
      {inputs.newPwCheck && <p>{pwCheckTxt}</p>}
      <br />
    </>
  )
}

export default ChangeProfile;

const UserPicPreview = styled.img`
  width: 150px;
  height: 150px;
  object-fit: cover;
  border: 1px solid lightgray;
`;