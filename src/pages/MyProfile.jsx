import React, { useState } from 'react';
import { useSelector } from "react-redux/es/hooks/useSelector";
import ChangeProfileImg from "components/profile/ChangeProfileImg";
import ChangeUserNameAndPw from "components/profile/ChangeUserNameAndPw";
import MyContents from "components/profile/MyContents";
import MyComments from "components/profile/MyComments";
import { styled } from "styled-components";

const MyProfile = () => {
  const [showContentsList, setShowContentsList] = useState(true);
  const [showCommentsList, setShowCommentsList] = useState(false);

  const onClickMyContentsList = () => {
    setShowContentsList(true);
    setShowCommentsList(false);
  }

  const onClickMyCommentsList = () => {
    setShowCommentsList(true);
    setShowContentsList(false);
  }

  const handleScrollToTop = () => {
    window.scrollTo({top:0, behavior: 'smooth'});
  };

  return (
    <ProfileWrapper>
      <ProfileInner>
        <ChangeProfileImgWrapper>
          <ChangeProfileImg />
          <ChangeUserNameAndPw />
        </ChangeProfileImgWrapper>
        <ProfileBtnContainer>
          <ProfileBtn onClick={onClickMyContentsList}>내가 쓴 글</ProfileBtn>
          <ProfileBtn onClick={onClickMyCommentsList}>내가 쓴 댓글</ProfileBtn>
        </ProfileBtnContainer>
        {showContentsList && <MyContents />}
        {showCommentsList && <MyComments />}
      </ProfileInner>
      <TopButton onClick={handleScrollToTop}> ▲ </TopButton>
    </ProfileWrapper>
  )
}

export default MyProfile;

const ChangeProfileImgWrapper = styled.div`
box-sizing: content-box;
  width: 300px;
  padding: 50px 70px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #c6dfd8;
  
  background-color: #fff;
`

const ProfileWrapper = styled.div `
  margin: 0 auto 50px;
  padding-top: 150px;
`

const ProfileInner = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 70%;
  margin: 0 auto;
  padding: 50px 100px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #b7d6ce;
  background-color: #cae9e1;
`

const ProfileBtnContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 100px;
`;

const ProfileBtn = styled.button`
  display: inline-block;
  width: 120px;
  height: 50px;

  font-size: 14px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 50px;
  text-align: center;
  
  border-radius: 25px;
  box-shadow: 3px 3px 5px #80c2b1;

  background-color: #5aceb1;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #39c4a1;
    color: #fff;
  }
`

const TopButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 5%;

  width: 60px;
  height: 60px;

  border-radius: 50%;
  box-shadow: 3px 3px 3px #acaf6d;

  font-size: 25px;
  font-weight: 800;
  line-height: 55px;

  background-color: #f8e9a5;
  color: #c2a421;
  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: #f1df8f;
  }
`
