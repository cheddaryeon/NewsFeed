import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
//
import CommentsList from "components/comments/CommentsList";
import AddComments from "components/comments/AddComments";
import DetailContentsList from "components/contents/DetailContetsList";

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
