import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
} from "@firebase/firestore";
import { dbService } from "fbase";
import { async } from "q";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { fetchComments } from "redux/modules/comments";

const CommentsList = () => {
  const dispatch = useDispatch();

  const comments = useSelector((state) => state.comments);

  const { contentsId } = useParams();

  const getCommetsQuery = async () => {
    const q = query(
      collection(dbService, "contents"),
      where(comments.contentsId, "==", contentsId),
      orderBy("commentsDate", "desc")
    );

    const querySnapshot = await getDocs(q);
    const eachCommentsArray = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    dispatch(fetchComments(eachCommentsArray));
  };

  useEffect(() => {
    getCommetsQuery();
  }, [comments]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const q = query(collection(dbService, "comments"));

  //     const querySnapshot = await getDocs(q);
  //     // console.log("querySnapshot :", querySnapshot);

  //     const comments_list = [];

  //     querySnapshot.forEach((doc) => {
  //       // console.log(doc.id, " => ", doc.data());
  //       const data = { id: doc.id, ...doc.data() };
  //       // console.log("data제발요", data);
  //       comments_list.push(data);
  //       // console.log("plzz : ", comments_list);
  //     });
  //     dispatch(fetchComments(comments_list));
  //   };

  //   fetchData();
  // }, []);

  return (
    <div>
      <ul>
        {comments.map((comment) => {
          return (
            <div key={comment?.contentsId}>
              <p>{comment.commentsWriterName}</p>
              <p>{comment.commentsBody}</p>
              <p>{comment.commentsOpinion}</p>
            </div>
          );
        })}
      </ul>
      <button> delete </button>
    </div>
  );
};

export default CommentsList;
