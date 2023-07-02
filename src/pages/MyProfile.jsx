import React from 'react';
import ChangeProfileImg from "components/profile/ChangeProfileImg";
import ChangeUserNameAndPw from "components/profile/ChangeUserNameAndPw";
import MyContents from "components/profile/MyContents";
import { styled } from "styled-components";

const MyProfile = () => {

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
        <MyListButton>내가 쓴 글</MyListButton>
        <MyContents />
      </ProfileInner>
      <TopButton onClick={handleScrollToTop}> ▲ </TopButton>
    </ProfileWrapper>
  )
}

export default MyProfile;

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

const ChangeProfileImgWrapper = styled.div`
box-sizing: content-box;
  width: 300px;
  padding: 50px 70px;
  border-radius: 30px;
  box-shadow: 5px 5px 10px #c6dfd8;
  
  background-color: #fff;
`

const MyListButton = styled.button`
  margin-top: 50px;
  width: 120px;
  height: 40px;

  border-radius: 20px;
  border: none;

  font-weight: 500;

  background-color: white;
  color: #5798c4;

  transition: 0.2s;
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