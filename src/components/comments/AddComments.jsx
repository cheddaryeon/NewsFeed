import { collection } from "@firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import comments, { addComment } from "redux/modules/comments";
import styled from "styled-components";

const AddComments = () => {
  //❶Create

  //
  const dispatch = useDispatch();

  // const [commentsWriter, setCommentsWriter] = useState("");
  const [commentsBody, setCommentsBody] = useState("");

  const { contentsId } = useParams();
  console.log("contentsId2 =>", contentsId);

  //
  const onSubmitHandler = (e) => {
    e.preventDefault();

    dispatch(
      addComment({
        selectedOption,
        commentsBody,
        contentsId,
      })
    );

    // dispatch({
    //   type: "ADD_COMMENT",
    //   payload: {
    //     commentsWriter,
    //     commentsBody,
    //     // contentsId,
    //   },
    // });

    setCommentsBody("");
  };

  //select
  const options = ["그뤠잇", "스튜핏"];

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  };

  return (
    <div>
      <h2 style={{ backgroundColor: "gray" }}>결재 의견 남기기</h2>
      <form onSubmit={onSubmitHandler}>
        {/* <p>결재자</p>
        <input
          name="이름"
          value={commentsWriter}
          onChange={(e) => {
            setCommentsWriter(e.target.value);
          }}
        ></input>
        <p>여기에 SELECT추가</p> */}
        <p>결재내용</p>
        <div>
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
        </div>
        <input
          name="내용"
          value={commentsBody}
          onChange={(e) => {
            setCommentsBody(e.target.value);
          }}
        ></input>
        <button type="submit">등록</button>
      </form>
    </div>
  );
};

export default AddComments;

const DropdownWrapper = styled.div`
  width: 150px;
  border: 1px solid black;
`;

const DropdownHeader = styled.div`
  padding: 10px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
`;

const DropdownList = styled.div`
  width: 150px;
  border: 1px solid black;
  position: absolute;
  background-color: white;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  &:hover {
    background-color: #100d0d;
  }
`;
