import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
//
import CommentsList from "components/comments/CommentsList";
import DetailContentsList from "components/contents/DetailContentsList";
import AddComments from "components/comments/AddComments";

const Detail = () => {
  return (
    <>
      <DetailContentsList />
      <AddComments />
      <CommentsList />
    </>
  );
};

export default Detail;
