import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
//
import CommentsList from "components/comments/CommentsList";
import AddComments from "components/comments/AddComments";
import DetailContentsList from "components/contents/DetailContetsList";
import { styled } from "styled-components";

const handleScrollToTop = () => {
  window.scrollTo({top:0, behavior: 'smooth'});
};

const Detail = () => {
  return (
    <>
      <DetailContentsList />
      <AddComments />
      <CommentsList />
      <TopButton onClick={handleScrollToTop}> ▲ </TopButton>
    </>
  );
};

const TopButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 50px;

  width: 70px;
  height: 70px;

  border-radius: 50%;
  box-shadow: 3px 3px 3px #ddd;

  font-size: 25px;
  font-weight: 800;
  line-height: 65px;

  background-color: rgb(201, 232, 255);
  color: #517a99;

  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: rgb(163, 207, 240);
  }
`

export default Detail;
