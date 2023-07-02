import { addComments } from "@babel/types";
import { addDoc, collection } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { styled } from "styled-components";

const AddComments = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const options = ["허가", "거절"];
  //useState
  //user
  const [commentsWriterId, setCommentsWriterId] = useState(currentUser.userId);
  const [commentsWriterName, setCommentsWriterName] = useState(
    currentUser.userName
  );
  //input
  const [commentsBody, setCommentsBody] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [commentsOpinion, setCommentsOpinion] = useState(null);

  let today = new Date();
  let time = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    hours: today.getHours(),
    minutes: today.getMinutes(),
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일 ${time.hours}시${time.minutes}분`;
  const [commentsDate, setCommentsDate] = useState(timestring);

  //hook
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //등록
  const onClickHandler = async (event) => {
    event.preventDefault();

    const newComments = {
      commentsWriterId,
      commentsWriterName,
      commentsDate,
      commentsOpinion,
      commentsBody,
    };

    const collectionRef = collection(dbService, "comments");
    const { id } = await addDoc(collectionRef, newComments);

    dispatch({
      type: "ADD_COMMENT",
      payload: {
        id: id,
        commentsWriterId,
        commentsWriterName,
        commentsDate,
        commentsOpinion,
        commentsBody,
      },
    });

    setCommentsBody("");
  };

  //select
  const selectClickHandler = (event) => {
    setCommentsOpinion(event);
    setIsOpen(false);
  };

  return (
    <CommentWrapper>
      <label>결재 의견 등록하기</label>
      <CommentInner>
        <DropdownWrapper>
          <DropdownHeader
            onClick={() => {
              setIsOpen((prev) => !prev);
            }}
          >
            {commentsOpinion || "결재 의견 선택▼"}
          </DropdownHeader>
          {isOpen && (
            <DropdownList>
              {options.map((option) => (
                <DropdownItem
                  key={option}
                  onClick={() => {
                    selectClickHandler(option);
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
            const { value } = e.target;
            setCommentsBody(value);
          }}
        ></textarea>
        <button onClick={onClickHandler}>등록</button>
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
`;

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
`;

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
