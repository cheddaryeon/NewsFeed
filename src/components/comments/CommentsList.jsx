import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddComments from "./AddComments";
import comments from "redux/modules/comments";
import { useParams } from "react-router-dom";

const CommentsList = () => {
  //
  const { contentsId } = useParams();
  console.log("contentsId2 =>", contentsId);

  //
  const comments = useSelector((state) => state.comments);
  console.log("state.comments의 값", comments);

  const filteredComments = comments.filter((comment) => {
    return comment.contentsId === contentsId;
  });
  console.log("흠", filteredComments);

  return filteredComments.map((comment) => {
    return (
      <div key={comment?.contentsId}>
        <p>{comment.selectedOption}</p>
        <p>결재내용: {comment.commentsBody}</p>
        <button>수정</button>
        <button>삭제</button>
      </div>
    );
  });

  // 댓글 목록 컴포넌트
  // const dispatch = useDispatch();
  // const comments = useSelector((state) => state.comments);

  // const [commentsWriter, setCommentsWriter] = useState("");
  // const [commentsBody, setCommentsBody] = useState("");

  // useEffect(() => {}, [commentsWriter, commentsBody]);

  // //아래 동작X
  // const commentsMap = comments.map((comment) => {
  //   return (
  //     <div
  //       style={{
  //         border: "1px solid black",
  //         padding: "10px",
  //         margin: "10px",
  //       }}
  //       key={comment?.id}
  //     >
  //       <p>결재자 : {comment.commentsWriter}</p>
  //       <p>결재내용 : {comment.commentsBody}</p>
  //       <button>수정</button>
  //       <button
  //         onClick={() => {
  //           dispatch({
  //             type: "DELETE_COMMENT",
  //             payload: comment.id,
  //           });
  //         }}
  //       >
  //         삭제
  //       </button>
  //     </div>
  //   );
  // });
  // return <div>{commentsMap}</div>;
};

export default CommentsList;
