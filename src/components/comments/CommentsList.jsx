import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddComments from "./AddComments";
import comments from "redux/modules/comments";
import { useParams } from "react-router-dom";
import { styled } from "styled-components";

const CommentsList = () => {
  // ❷Read
  //useParams로 filteredComments 셋팅
  const { contentsId } = useParams();
  const filteredComments = comments.filter((comment) => {
    return comment.contentsId === contentsId;
  });

  //useStates

  //UseSelectors
  const comments = useSelector((state) => state.comments);

  //-----------------------------------------------------------------//
  return filteredComments.map((comment) => {
    return (
      <CommentsWrapper key={comment?.contentsId}>
        <span>
          결재자: <span>결재자이름삽입</span>
        </span>
        <p>
          결재: <span>{comment?.selectedOption}</span>
        </p>
        <p>
          결재 의견: <span>{comment?.commentsBody}</span>
        </p>
        <ButtonBox>
          <button>수정</button>
          <button>삭제</button>
        </ButtonBox>
      </CommentsWrapper>
    );
  });
};

const CommentsWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  margin: 0 auto 30px;
  padding: 60px 100px 50px;
  border-radius: 30px;
  background-color: #ffeee6;

  &:last-of-type {
    margin-bottom: 50px;
  }

  & > span {
    position: absolute;
    top: 20px;
    left: 30px;
    padding: 10px 20px;
    border-radius: 21px;
    background-color: #fff;

    font-size: 18px;
    font-weight: 500;
  }

  & > span > span {
    font-weight: 600;
    color: #df7951;
  }

  & > p {
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.7px;
    color: #333;
  }

  & > p > span {
    margin-left: 5px;
    font-size: 19px;
    font-weight: 600;
    color: #df7951;
  }
`;

const ButtonBox = styled.form`
  position: absolute;
  top: -10px;
  right: 20px;
  margin-top: 30px;

  & > button {
    width: 60px;
    height: 30px;

    border-radius: 15px;

    font-size: 14px;
    font-weight: 500;

    background-color: white;
    color: #df7951;

    transition: 0.2s;

    &:hover {
      background-color: #df7951;
      color: #ffffff;
    }
  }
  & > button:first-child {
    margin-right: 10px;
  }
`;

export default CommentsList;
