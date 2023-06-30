import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";
//
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteContents, updateContents } from "redux/modules/contents";
import { styled } from "styled-components";

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
      <DetailListsWrapper>
        <DetailListsInner>
          <DetailList>
            <p>결제 품목: <span>{targetContent?.wishItemText}</span></p>
            <p>가격: <span>{targetContent?.itemPriceText}</span></p>
            <p>결제 요청 사유: <span>{targetContent?.wishReasonText}</span></p>
          </DetailList>
          <ButtonBox>
            <button onClick={editModeHandler}>수정</button>
            <button onClick={() => deleteHandler(targetContent?.id)}>
              삭제
            </button>
          </ButtonBox>
        </DetailListsInner>
      </DetailListsWrapper>

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

const DetailListsWrapper = styled.ul`
  padding: 150px 0 50px;
  width: 70%;
  margin: 0 auto;
  text-align: center;
`

const DetailListsInner = styled.li`
  padding: 50px 100px;

  border-radius: 30px;
  background-color: #caf0d4;

  box-shadow: 5px 5px 10px #eee;

  & > p {
    margin-bottom: 40px;
    font-size: 24px;
    font-weight: 600;
    color: #30924a;
  }
`

const DetailList = styled.div`
  & > p {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.7px;
    color: #333;
  }

  & > p > span {
    margin-left: 5px;
    font-size: 19px;
    font-weight: 600;
    color: #1d7735;
  }
`

const ButtonBox = styled.form`
  margin-top: 50px;

  & > button {
    width: 100px;
    height: 35px;

    border-radius: 18px;

    font-size: 16px;
    font-weight: 500;

    background-color: white;
    color: #30924a;

    transition: 0.2s;

    &:hover {
      background-color: #44a35d;
      color: #ffffff;
    }
  }
  & > button:first-child {
    margin-right: 30px;
  }
`

export default DetailContentsList;