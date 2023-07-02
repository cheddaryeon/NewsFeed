import uuid from "react-uuid";
import { useState } from 'react';

import { authService, storageService } from "fbase";
import { updateProfile } from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

import { useDispatch, useSelector } from "react-redux";
import { setUserInfo } from "redux/modules/auth";

import { styled } from "styled-components";

const ChangeProfileImg = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => (state.auth.user))
  const [imgFileUrl, setImgFileUrl] = useState(currentUser.userPic);

  // console.log("ChangeProfileImg.jsx 현재 img url state => ", imgFileUrl);

  // '파일 선택' img file 변경감지
  const onImgFileChange = (e) => {
    const files = e.target?.files;
    if (files) {
      // fileReader API
      const theFile = files[0];
      const imgFileReader = new FileReader();
      imgFileReader.onloadend = (finishedEvent) => {
        const { currentTarget: { result } } = finishedEvent;
        setImgFileUrl(result);
      }
      if (theFile) {
        imgFileReader.readAsDataURL(theFile);
      }
    }
  }

  // x버튼 누르면 이미지 미리보기 -> 다시 현재 프로필 이미지로
  const onClearImgFile = () => {
    if (imgFileUrl === currentUser.userPic) {
      window.alert("변경할 프로필 이미지를 선택해주세요!");
      return;
    }
    setImgFileUrl(currentUser.userPic);
  };

  // console.log(currentUser.userPic)
  // console.log(imgFileUrl);

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
  
  return (
    <>
      <MyProfileTitle>My Profile</MyProfileTitle>
      <UserPicPreview src={imgFileUrl} width="150px" height="150px" />
      <ProfileImgContainer>
        <ProfileImgForm onSubmit={handleChangeUserPic}>
          <label htmlFor="inUserPic">프로필 사진 변경</label>
          <input
            name="userPic"
            id="inUserPic"
            type="file"
            accept="image/*"
            onChange={onImgFileChange}
          />
          <input type="submit" value={"변경된 이미지 등록"} />
        </ProfileImgForm>
        <ImgClearBtn onClick={onClearImgFile}>✖️</ImgClearBtn>
      </ProfileImgContainer>
    </>
  );
}

export default ChangeProfileImg;

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

const ProfileImgContainer = styled.div`
  position: relative;
`

const ProfileImgForm = styled.form`
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
    width: 150px;
    margin: 0 auto;
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
`

const ImgClearBtn = styled.button`
  position: absolute;
  top: 48px;
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
`;