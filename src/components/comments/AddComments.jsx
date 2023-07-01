import uuid from "react-uuid";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";

import comments, { addComment } from "redux/modules/comments";
import styled from "styled-components";

const AddComments = () => {
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.user);
  const { contentsId } = useParams();

  const [commentsBody, setCommentsBody] = useState("");

  console.log("AddComments.jsx 현재 로그인 유저 => ", currentUser)
  console.log("AddComments.jsx 게시글 id => ", contentsId);

  const onSubmitComment = async (e) => {
    e.preventDefault();
    const ok = window.confirm("댓글을 등록하시겠어요?");
    if (ok) {
      try {
        // 댓글 등록 -> fb firestore 서버에 전송
        // 순서대로 댓글작성자 uid, 닉네임, 댓글내용, 작성시간
        await addDoc(collection(dbService, "comments"), {
          contentsId,
          commentsWriterId: currentUser.userId,
          commentsWriter: currentUser.userName,
          commentsOpinion: selectedOption,
          commentsBody,
          commentsDate: Date.now(),
        })
      } catch (error) {
        alert("댓글이 정상적으로 등록되지 않았습니다. 다시 시도해주세요.")
        console.log("댓글 등록 에러 : ", error);
      }
    }
    setCommentsBody("");
  };

  //select
  const options = ["허가", "거절"];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <CommentWrapper>
      <label>결재 의견 등록하기</label>
      <CommentInner onSubmit={onSubmitComment}>
        {/* <p>결재자</p>
        <input
          name="이름"
          value={commentsWriter}
          onChange={(e) => {
            setCommentsWriter(e.target.value);
          }}
        ></input>
        <p>여기에 SELECT추가</p> */}
          <DropdownWrapper>
            <DropdownHeader
              onClick={() => {
                setIsOpen((prev) => !prev);
              }}
            >
              {selectedOption || "그뤠잇/스튜핏 v"}
            </DropdownHeader>
            {isOpen && (
              <DropdownList>
                {options.map((option) => (
                  <DropdownItem
                    key={option}
                    onClick={() => {
                      handleOptionClick(option);
                    }}
                  >
                    {option}
                  </DropdownItem>
                ))}
              </DropdownList>
            )}
          </DropdownWrapper>
          <textarea
            name="내용"
            placeholder="상세한 결재 의견을 입력해 주세요 &#13;&#10; ex) 예쁜 쓰레기가 될 것이 뻔해 보여서 결재 거절함!"
            value={commentsBody}
            onChange={(e) => {
              setCommentsBody(e.target.value);
            }}
          ></textarea>
          <button type="submit">등록</button>
      </CommentInner>
    </CommentWrapper>
  );
};

export default AddComments;

const CommentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 70%;
  margin: 0 auto 50px;
  padding: 50px 100px;
  border-radius: 30px;
  background-color: #fadcd0;

  & > label {
    margin-bottom: 20px;
    font-size: 24px;
    font-weight: 600;
    color: #d8521d;
  }
`

const CommentInner = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;

  & > textarea {
    width: 100%;
    height: 120px;
    padding: 15px 20px;
    margin-bottom: 30px;

    border: none;
    border-radius: 10px;

    line-height: 1.6;
    font-size: 16px;
    color: #666;

    overflow: auto;
    resize: none;
    
    &::placeholder {
      color: #aeaeae;
    }
  }

  & > button {
    width: 100px;
    height: 35px;

    border-radius: 18px;

    font-size: 16px;
    font-weight: 500;

    background-color: white;
    color: #ee7a4c;

    transition: 0.2s;

    &:hover {
      background-color: #ee6833;
      color: #ffffff;
    }
  }
`

const DropdownWrapper = styled.div`
  width: 200px;
  height: 40px;
  margin: 0 auto 30px;
  border-radius: 10px;
  box-shadow: 3px 3px 3px #ffc7b0;
  background-color: #fff;
  color: #ee7a4c;
  transition: 0.2s;

  
  &:hover {
    background-color: #f0b8a2;
    color: #fff;
  }
`;

const DropdownHeader = styled.div`
  font-size: 18px;
  font-weight: 400;
  line-height: 40px;
  cursor: pointer;
  text-align: center;
`;

const DropdownList = styled.div`
  width: 200px;
  position: absolute;
  border-radius: 10px;
`;

const DropdownItem = styled.div`
  width: 200px;
  margin: 4px 0px;
  padding: 10px;
  cursor: pointer;
  border-radius: 10px;
  box-shadow: 3px 3px 3px #ffc7b0;
  background-color: #fdf3ef;
  transition: 0.2s;
  color: #ee7a4c;
  &:hover {
    background-color: #da8b6c;
    color: #fff;
  }
`;