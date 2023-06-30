import { storageService } from "fbase";
import { ref, uploadString, getDownloadURL } from "firebase/firestore";
import { updatePassword } from "firebase/auth";
import { useState } from 'react';
import { useSelector, useDispatch } from "react-redux";

console.log()

const MyProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    userName: "",
    newPw: "",
    newPwCheck: "",
    userPic: "",
  })
  const [error, setError] = useState(false);
  const [errorCheck, setErrorCheck] = useState("");
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.userPic);
  
  // console.log("MyProfile.jsx => ", newProfileData);

  const onChange = async (e) => {
    const { value, name } = e.target;
    setInputs((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // 비밀번호 유효성검사
    const { newPw } = inputs;
    if (name === "newPwCheck") {
      if (newPw !== value) {
        setErrorCheck("비밀번호와 확인이 일치하지 않습니다.")
        setError(true);
      } else {
        setErrorCheck("비밀번호와 확인이 일치합니다.");
        setError(false)
      }
    }
  };

  const onImgFileChange = (e) => {
    const files = e.target?.files;

    // filerReader API
    // 1. input에 있는 모든 파일 중 첫번째 파일만
    const theFile = files[0];
    // 2. 그 파일로 reader 생성
    const imgFileReader = new FileReader();
    // 3. reader에 이벤트리스너 추가
    imgFileReader.onloadend = (finishedEvent) => {
      const { currentTarget: { result }
        , } = finishedEvent;
      setImgFileUrl(result);
    }
    // 4. readAsDataURL API로 사진 이미지 얻음
    imgFileReader.readAsDataURL(theFile);
  }

  const onClearImgFile = () => setImgFileUrl(currentUser.userPic);

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("MyProfile.jsx 에러 상태", error);
    // 닉네임 변경
    if (!error) {
      try {
        const { photoURL, userName, newPw, newPwCheck } = inputs;
        await updateProfile(user, {
          displayName: userName,
          photoURL,
        });
        await updatePassword(user,)
        dispatch(setUserInfo({
          userId: user.uid,
          userName: user.displayName,
          userPic: user.photoURL,
        }))
        setInputs({
          email: "",
          userName: "",
          newPw: "",
          newPwCheck: "",
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
      <img src={imgFileUrl} width="150px" height="150px" />
      <form>
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
      <form>
        <input
          name="email"
          id="inUserEmail"
          type="text"
          placeholder={currentUser.userEmail ? currentUser.userEmail : "Google"}
          disabled
        />
        <br />
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
        </form>
      <br />
      <form>
        <label htmlFor="innewPw">
          비밀번호 변경
        </label>
        <input
          name="newPw"
          id="innewPw"
          type="password"
          placeholder="변경할 비밀번호를 입력하세요."
          value={inputs.newPw}
          onChange={onChange}
        />
          <br />
        <label htmlFor="innewPwCheck">
          비밀번호 변경 확인
        </label>
        <input
          name="newPw"
          id="innewPwCheck"
          type="password"
          placeholder="변경할 비밀번호를 입력하세요."
          value={inputs.newPw}
          onChange={onChange}
        />
          <br />
          <p>{inputs.newPwCheck && errorCheck}</p>
          <input type="submit" value={"프로필 변경"} />
        </form>
      <br />
    </>
  )
}

export default MyProfile;