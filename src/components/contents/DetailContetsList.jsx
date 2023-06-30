import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  deleteContents,
  fetchContents,
  updateContents,
} from "redux/modules/contents";

const DetailContentsList = () => {
  //❷ Read
  //contentsId값 잘 넘어오고 있나 확인
  // const params = useParams();
  // console.log({ params });
  const { contentsId } = useParams();
  // console.log("contentsId =>", contentsId);

  //contentsId에 해당하는 게시글을 이제부터 targetContent라고 하겠습니다.
  const contents = useSelector((state) => state.contents);
  const targetContent = contents.filter((item) => item.id === contentsId)[0];
  // const targetContent1 = contents.find((item) => item.id === contentsId);

  console.log("3. targetContent => ", targetContent);

  //----------------------------------------------------------------------//
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //수정모드on, off
  const [editing, setEditing] = useState(false);
  const [showUpdatedContent, setShowUpdatedContent] = useState(false);

  //업데이트된값
  const [newWishItemText, setNewWishItemText] = useState("");
  const [newItemPriceText, setNewItemPriceText] = useState("");
  const [newWishReasonText, setNewWishReasonText] = useState("");

  //❸ Update
  const editModeHandler = () => {
    //목) 추후 로그인정보 일치할 경우에만 가능한 로직 추가
    setEditing((prev) => !prev);
  };

  //❹ Delete
  //여기서 payload는 삭제할 게시글의 id를 의미
  const deleteHandler = async (payload) => {
    const contentsRef = doc(dbService, "contents", payload);
    await deleteDoc(contentsRef);

    dispatch(deleteContents(payload));

    // dispatch(
    //   {
    //     type: "DELETE_CONTENTS",
    //     payload: {

    //     }
    //   }
    // )

    navigate("/");
  };



  return (
    <>
      {/*-------- 1. 상세게시글 랜더링 부분 --------*/}
      {/*-------- 3. updated redux -> useSelector로 불러와서 -> 수정 결과물 랜더링 부분 (fetchData()로 불러오는 것 x)--------*/}
      <>
        {editing &&
        newWishItemText &&
        newItemPriceText &&
        newWishReasonText &&
        showUpdatedContent ? (
          <ul className="updated_DetailListsWrapper">
            <li style={{ border: "solid", marginTop: "20px", padding: "20px" }}>
              <div>
                <p>결제 품목: {targetContent?.newWishItemText}</p>
                <p>가격: {targetContent?.newItemPriceText}</p>
                <p>결제 요청 사유: {targetContent?.newWishReasonText}</p>
              </div>
              {/* <div>
            <button onClick={editModeHandler}>수정</button>
            <button onClick={() => deleteHandler(targetContent?.id)}>
              삭제
            </button>
          </div> */}
            </li>
          </ul>
        ) : (
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
        )}
      </>

      {/*-------- 2. 수정입력폼 랜더링 부분 --------*/}
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
                type="submit"
                onClick={async (e) => {
                  //prevnetDefault를 걸어주지 않으면, await까지 가기 전에 페이지 새로고침 할 때면 수정 반영이 안됨
                  e.preventDefault();

                  //dB에 보내기전, 입력값이 잘 들어오는지 확인하기
                  console.log("newItemPriceText", newItemPriceText);
                  console.log("newWishItemText", newWishItemText);
                  console.log("wishReasonText", newWishItemText);

                  const targetContentRef = doc(
                    dbService,
                    "contents",
                    targetContent.id
                  );
                  //dB 업데이트
                  await updateDoc(targetContentRef, {
                    itemPriceText: newItemPriceText,
                    wishItemText: newWishItemText,
                    wishReasonText: newWishItemText,
                  });

                  // 수정완료 버튼 클릭 시 수정 결과물을 렌더링하도록 상태 값 업데이트
                  setShowUpdatedContent(true);

                  //
                  navigate("/");
                }}
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
