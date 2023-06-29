import React from "react";
//
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const DetailContentsList = () => {
  //contentsId값 잘 넘어오고 있나 확인
  // const params = useParams();
  // console.log({ params });
  const { contentsId } = useParams();
  console.log("contentsId =>", contentsId);

  //contentsId에 해당하는 게시글 붙러와서 붙이기 시작
  const contents = useSelector((state) => state.contents);
  const targetContent = contents.filter((item) => item.id === contentsId)[0];
  console.log("targetContent => ", targetContent);

  return (
    <ul className="DetailListsWrapper">
      <li style={{ border: "solid", marginTop: "20px", padding: "20px" }}>
        <div>
          <p>결제 품목: {targetContent.wishItemText}</p>
          <p>가격: {targetContent.itemPriceText}</p>
          <p>결제 요청 사유: {targetContent.wishReasonText}</p>
        </div>
        <div>
          <button>수정</button>
          <button>삭제</button>
        </div>
      </li>
    </ul>
  );
};

export default DetailContentsList;
