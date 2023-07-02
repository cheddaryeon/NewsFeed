import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
//
import CommentsList from "components/comments/CommentsList";
import AddComments from "components/comments/AddComments";
import DetailContentsList from "components/contents/DetailContetsList";
import { styled } from "styled-components";

const handleScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
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
`;

export default Detail;
