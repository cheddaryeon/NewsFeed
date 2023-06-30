import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "fbase";
import { useDispatch } from "react-redux";
import { addContents, fetchContents } from "redux/modules/contents";
import { styled } from "styled-components";

const AddContents = () => {
  //❶Create

  //
  const [wishItemText, setWishItemText] = useState("");
  const [itemPriceText, setItemPriceText] = useState("");
  const [wishReasonText, setWishReasonText] = useState("");
  //

  //
  const dispatch = useDispatch();

  //
  const onClickHandler = (event) => {
    event.preventDefault();

    //
    dispatch(
      addContents({
        wishItemText,
        itemPriceText,
        wishReasonText,
      })
    );

    // dispatch(
    //   {
    //     type: "ADD_CONTENTS",
    //     payload: {
    //       wishItemText,
    //   itemPriceText,
    //   wishReasonText,
    //     }
    //   }
    // )

    setWishItemText("");
    setItemPriceText("");
    setWishReasonText("");
  };

  //------------------------------------------------//

  return (
    <Container>
      <InputFormWrapper>
        <p>결재 요청 작성</p>
        <InputForm>
          <label>결재 품목</label>
          <input
            type="text"
            placeholder="ex) 치킨"
            value={wishItemText}
            onChange={(event) => {
              const { value } = event.target;
              setWishItemText(value);
            }}
          />{" "}
          <label>품목 가격</label>
          <input
            type="text"
            placeholder="ex) 18000원"
            value={itemPriceText}
            onChange={(event) => {
              const { value } = event.target;
              setItemPriceText(value);
            }}
          />{" "}
          <label>품목 사진</label>
          <button>이미지 업로드</button>
          <label>결재 요청 사유</label>
          <textarea
            value={wishReasonText}
            onChange={(event) => {
              const { value } = event.target;
              setWishReasonText(value);
            }}
            placeholder="해당 물품의 결재를 희망하는 이유를 알려주세요 :)"
          />
          <ButtonBox>
            <button>취소</button>
            <button onClick={onClickHandler}>등록</button>
          </ButtonBox>
        </InputForm>
      </InputFormWrapper>
    </Container>
  );
};

const Container = styled.div`
  padding: 150px 0 50px;
  width: 70%;
  margin: 0 auto;
  text-align: center;
`

const InputFormWrapper = styled.div`
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
const InputForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  & > label {
    margin: 15px 0 5px;
    font-size: 18px;
    font-weight: 500;
    color: #4a4a4a;
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

  & > button {
    width: 150px;
    height: 35px;
    margin-bottom: 10px;
    border-radius: 18px;
    font-weight: 500;
    background-color: white;
    color: #30924a;
    transition: 0.2s;

    &:hover {
      background-color: #44a35d;
      color: #ffffff;
      box-shadow: none;
    }
  }

  & > textarea {
    width: 500px;
    height: 200px;
    padding: 20px 30px;

    border: none;
    border-radius: 10px;

    font-size: 16px;
    color: #666;

    overflow: auto;
    resize: none;
    
    &::placeholder {
      color: #aeaeae;
    }
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

export default AddContents;
