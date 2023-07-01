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
import { styled } from "styled-components";

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

  //
  const currentUser = useSelector((state) => state.auth.user);

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
    console.log(currentUser);
    if (targetContent.contentsWriterId !== currentUser.userId) {
      alert("수정 권한이 없습니다.");
      return;
    } else {
      setEditing((prev) => !prev);
    }
  };

  //❹ Delete
  //여기서 payload는 삭제할 게시글의 id를 의미
  const deleteHandler = async (payload) => {
    if (targetContent.contentsWriterId !== currentUser.userId) {
      alert("삭제 권한이 없습니다.");
      return;
    }
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
          <DetailListsWrapper>
            <RequestTitle>요청된 결재건</RequestTitle>
            <DetailListsInner>
              <DetailList>
                <p>
                  결재 요청자: <span>{targetContent?.contentsWriterName}</span>
                </p>
                <p>요청일시: {targetContent?.contentsDate}</p>
                <p>
                  결재 품목: <span>{targetContent?.newWishItemText}</span>
                </p>
                <p>
                  가격: <span>{targetContent?.newItemPriceText}</span>
                </p>
                <p>
                  결재 요청 사유:{" "}
                  <span>{targetContent?.newWishReasonText}</span>
                </p>
              </DetailList>
            </DetailListsInner>
          </DetailListsWrapper>
        ) : (
          <DetailListsWrapper>
            <RequestTitle>요청된 결재건</RequestTitle>
            <DetailListsInner>
              <DetailList>
                <p>
                  결재 요청자: <span>{targetContent?.contentsWriterName}</span>
                </p>
                <p>요청일시: {targetContent?.contentsDate}</p>
                {/* 이미지 태그 */}
                <img src={targetContent?.downloadURL} alt="이미지 없음" />
                {/*  */}
                <p>
                  결재 품목: <span>{targetContent?.wishItemText}</span>
                </p>
                <p>
                  가격: <span>{targetContent?.itemPriceText}</span>
                </p>
                <p>
                  결재 요청 사유: <span>{targetContent?.wishReasonText}</span>
                </p>
              </DetailList>
              <ButtonBox>
                <button onClick={editModeHandler}>수정</button>
                <button onClick={() => deleteHandler(targetContent?.id)}>
                  삭제
                </button>
              </ButtonBox>
            </DetailListsInner>
          </DetailListsWrapper>
        )}
      </>

      {/*-------- 2. 수정입력폼 랜더링 부분 --------*/}
      <div>
        {editing ? (
          <>
            <EditInputForm>
              <p>글 수정하기</p>
              <label>결재 품목</label>
              <input
                type="text"
                placeholder={targetContent?.wishItemText}
                value={newWishItemText}
                onChange={(e) => {
                  setNewWishItemText(e.target.value);
                }}
              />
              <label>가격</label>
              <input
                type="text"
                placeholder={targetContent?.itemPriceText}
                value={newItemPriceText}
                onChange={(e) => {
                  setNewItemPriceText(e.target.value);
                }}
              />
              <label>결재 요청 사유</label>
              <textarea
                type="text"
                placeholder={targetContent?.wishReasonText}
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
                    wishReasonText: newWishReasonText,
                  });

                  // 수정완료 버튼 클릭 시 수정 결과물을 렌더링하도록 상태 값 업데이트
                  setShowUpdatedContent(true);

                  //
                  navigate("/");
                }}
              >
                완료
              </button>
            </EditInputForm>
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
`;

const RequestTitle = styled.p`
  margin-bottom: 50px;
  font-size: 24px;
  font-weight: 600;
  color: #1d7735;
`;

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
`;

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
`;

const ButtonBox = styled.div`
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
`;

const EditInputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  width: 70%;

  margin: 0 auto 50px;
  padding: 50px 100px;

  border-radius: 30px;
  background-color: #cae2f0;

  & > p {
    margin-bottom: 20px;
    font-size: 22px;
    font-weight: 600;
    color: #4d75cc;
  }

  & > label {
    font-size: 18px;
    font-weight: 500;
    margin: 10px 0px 5px;
  }

  & > input {
    width: 500px;
    height: 40px;
    padding: 0 20px;

    border: none;
    border-radius: 15px;
    font-size: 16px;
    color: #666;

    &::placeholder {
      color: #aeaeae;
    }
  }

  & > textarea {
    width: 500px;
    height: 120px;
    padding: 15px 20px;
    margin-bottom: 10px;

    border: none;
    border-radius: 10px;

    font-size: 16px;
    line-height: 1.6;
    color: #666;

    overflow: auto;
    resize: none;

    &::placeholder {
      color: #aeaeae;
    }
  }

  & > button {
    width: 100px;
    height: 35px;

    border-radius: 18px;

    font-size: 16px;
    font-weight: 500;

    background-color: white;
    color: #4d75cc;

    transition: 0.2s;

    &:hover {
      background-color: #4d75cc;
      color: #ffffff;
    }
  }
`;

export default DetailContentsList;
