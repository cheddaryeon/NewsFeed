import React, { useState } from 'react';
import ChangeProfile from "components/profile/ChangeProfile";

import { styled } from "styled-components";
import MyContents from "components/profile/MyContents";
import MyComments from "components/profile/MyComments";

const MyProfile = () => {
  const [showChangeForm, setShowChangeForm] = useState(false);
  const [showContentsList, setShowContentsList] = useState(true);
  const [showCommentsList, setShowCommentsList] = useState(false);

  const handleChangeForm = () => {
    // 내 프로필 변경 버튼 클릭하면 프로필 변경 양식 열렸다가 닫혔다가 작동
    setShowChangeForm(!showChangeForm);
  }

  const onClickMyContentsList = () => {
    setShowContentsList(true);
    setShowCommentsList(false);
  }

  const onClickMyCommentsList = () => {
    setShowCommentsList(true);
    setShowContentsList(false);
  }

  return (
    <>
      {/* 위에 Header 때문에 안보여서 <br /> 폭탄이에요 나중에 다 지워도됩니당 */}
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <ProfileBtn onClick={handleChangeForm}>프로필 변경하기 ▼</ProfileBtn>
      {showChangeForm && <ChangeProfile />}
      <br />
      <ListBtn onClick={onClickMyContentsList}>내가 요청한 결재 목록</ListBtn>
      <ListBtn onClick={onClickMyCommentsList}>내가 작성한 댓글</ListBtn>
      {showContentsList && <MyContents />}
      {showCommentsList && <MyComments />}
    </>
  )
}

export default MyProfile;

const ProfileBtn = styled.button`
  display: inline-block;
  width: 150px;
  height: 50px;
  margin-bottom: 50px;

  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 50px;
  text-align: center;
  
  border-radius: 25px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #5aceb1;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #39c4a1;
    color: #fff;
  }
`;

const ListBtn = styled.button`
  display: inline-block;
  width: 150px;
  height: 50px;
  margin: 20px;

  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 50px;
  text-align: center;
  
  border-radius: 25px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #5aceb1;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #39c4a1;
    color: #fff;
  }
`;