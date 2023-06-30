import { useState } from 'react';
import { useSelector } from "react-redux";

const ChangeProfile = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [inputs, setInputs] = useState({
    userName: "",
    newPw: "",
    newPwCheck: "",
    userPic: "",
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

  const handleChangeUserPic = async (e) => {
    e.preventDefault();
    // 프로필 사진 변경
  }

  const handleChangeUserName = async (e) => {
    e.preventDefault();
    // 닉네임 변경
  }

  const handleChangePw = async (e) => {
    e.preventDefault();
    // 비밀번호 변경
    if (!pwError) {
      try {
        // firebase 서버에 변경 비밀번호 업데이트
      } catch (error) {
        // 비밀번호 변경 실패
      }
    }
  }
  
  return (
    <>
      <h2>My Profile</h2>
      <img src={imgFileUrl} width="150px" height="150px" />
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
          placeholder={currentUser.userEmail ? currentUser.userEmail : "Google"}
          disabled
        />
      <br />
      <form onSubmit={handleChangeUserName}>
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
          placeholder="변경할 비밀번호"
          value={inputs.newPw}
          onChange={onChange}
        />
        <br />
        <input
          name="newPwCheck"
          id="inNewPwCheck"
          type="password"
          placeholder="비밀번호 변경 확인"
          value={inputs.newPwCheck}
          onChange={onChange}
        />
        <input type="submit" value={"비밀번호 변경"} />
      </form>
      {inputs.newPwCheck > 0 && <p>{pwCheckTxt}</p>}
      <br />
    </>
  )
}

export default ChangeProfile;