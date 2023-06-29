import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteContents, updateContents } from "redux/modules/contents";

const DetailContentsList = () => {
  //❷ Read
  //contentsId값 잘 넘어오고 있나 확인
  // const params = useParams();
  // console.log({ params });
  const { contentsId } = useParams();
  console.log("contentsId =>", contentsId);

  //contentsId에 해당하는 게시글을 이제부터 targetContent라고 하겠습니다.
  const contents = useSelector((state) => state.contents);
  const targetContent = contents.filter((item) => item.id === contentsId)[0];
  // const targetContent1 = contents.find((item) => item.id === contentsId);

  console.log("targetContent => ", targetContent);

  //----------------------------------------------------------------------//
  //
  const dispatch = useDispatch();

  //
  const navigate = useNavigate();

  //수정모드on, off
  const [editing, setEditing] = useState(false);

  //업데이트된값
  const [newWishItemText, setNewWishItemText] = useState("");
  const [newItemPriceText, setNewItemPriceText] = useState("");
  const [newWishReasonText, setNewWishReasonText] = useState("");

  //❸ Update
  const editModeHandler = () => {
    //목) 추후 로그인정보 일치할 경우에만 가능한 로직 추가
    setEditing((prev) => !prev);
  };

  const submitUpdatedStatusHandler = async (targetContentId) => {
    //
    const contentsRef = doc(dbService, "contents", targetContentId);

    await updateDoc(contentsRef, {
      ...contents,
      itemPriceText: newItemPriceText,
      wishItemText: newWishItemText,
      wishReasonText: newWishReasonText,
    });

    navigate("/");

    //
    // dispatch(updateContents());

    //
    // dispatch(
    //   {
    //     type: "UPDATE_CONTENTS",
    //     payload: {
    //       wishItemText: newWishItemText,
    //       itemPriceText: newItemPriceText,
    //       wishReasonText: newWishReasonText,
    //     }
    //   }
    // )
  };

  //❹ Delete
  const deleteHandler = async (payload) => {
    const contentsRef = doc(dbService, "contents", payload);
    await deleteDoc(contentsRef);

    dispatch(deleteContents(payload));

    navigate("/");
  };

  return (
    <>
      <ul className="DetailListsWrapper">
        <li style={{ border: "solid", marginTop: "20px", padding: "20px" }}>
          <div>
            <p>결제 품목: {targetContent?.wishItemText}</p>
            <p>가격: {targetContent?.itemPriceText}</p>
            <p>결제 요청 사유: {targetContent?.wishReasonText}</p>
          </div>
          <div>
            <button onClick={editModeHandler}>수정</button>
            <button onClick={() => deleteHandler(targetContent?.id)}>
              삭제
            </button>
          </div>
        </li>
      </ul>

      <div>
        {editing ? (
          <>
            <form>
              <input
                type="text"
                value={newWishItemText}
                onChange={(e) => {
                  setNewWishItemText(e.target.value);
                }}
              />
              <input
                type="text"
                value={newItemPriceText}
                onChange={(e) => {
                  setNewItemPriceText(e.target.value);
                }}
              />
              <input
                type="text"
                value={newWishReasonText}
                onChange={(e) => {
                  setNewWishReasonText(e.target.value);
                }}
              />
              <button
                onClick={() => submitUpdatedStatusHandler(targetContent?.id)}
              >
                수정 완료
              </button>
            </form>
          </>
        ) : null}
      </div>
    </>
  );
};

export default DetailContentsList;
