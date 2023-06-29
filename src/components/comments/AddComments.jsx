import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import comments, { addComment } from "redux/modules/comments";

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
