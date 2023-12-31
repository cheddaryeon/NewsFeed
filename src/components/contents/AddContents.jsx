import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { dbService } from "fbase";
import { useDispatch, useSelector } from "react-redux";
import { addContents, fetchContents } from "redux/modules/contents";
import { styled } from "styled-components";
import { useNavigate } from "react-router-dom";
//
import { storageService, authService } from "fbase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const AddContents = () => {
  //UseSelector
  const currentUser = useSelector((state) => state.auth.user);
  console.log("Add Contents User => ", currentUser);

  //UseStates
  //user용
  const [contentsWriterId, setContentsWriterId] = useState(currentUser.userId);
  const [contentsWriterName, setContentsWriterName] = useState(
    currentUser.userName
  );
  const [imageUpload, setImageUpload] = useState(null);
  const [downloadURL, setDownloadURL] = useState(null);

  //input창용
  const [wishItemText, setWishItemText] = useState("");
  const [itemPriceText, setItemPriceText] = useState("");
  const [wishReasonText, setWishReasonText] = useState("");

  //contentsDate 정의
  let today = new Date();
  let time = {
    year: today.getFullYear(),
    month: today.getMonth() + 1,
    date: today.getDate(),
    hours: today.getHours(),
    minutes: today.getMinutes(),
  };
  let timestring = `${time.year}년 ${time.month}월 ${time.date}일 ${time.hours}시${time.minutes}분`;
  const [contentsDate, setContentsDate] = useState(timestring);

  //---------------------------------------------------------------------------------------------------//
  //hooks
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //❶Create 게시글
  const onClickHandler = async (event) => {
    if (downloadURL) {
      //
      event.preventDefault();

      //
      const newContents = {
        contentsWriterId,
        contentsWriterName,
        contentsDate,
        wishItemText,
        itemPriceText,
        wishReasonText,
        downloadURL,
        createdAt: serverTimestamp(),
      };

      //
      const collectionRef = collection(dbService, "contents");
      const { id } = await addDoc(collectionRef, newContents); //fB에서 가져온 데이터의 속성 중, 구조분해할당으로 id값만 따로 받겠다는 뜻

      //
      dispatch(
        addContents({
          id,
          wishItemText,
          itemPriceText,
          wishReasonText,
          contentsWriterId,
          contentsWriterName,
          contentsDate,
          downloadURL,
          createdAt: serverTimestamp(),
        })
      );

      setWishItemText("");
      setItemPriceText("");
      setWishReasonText("");

      //
      alert("게시글이 등록되었습니다!");

      //
      // navigate("/");
    } else {
      alert("이미지 등록부터 부탁드립니다!");
    }
  };

  //
  //❷Create 이미지
  const uploadImage = async (event) => {
    //
    event.preventDefault();

    //
    // if (imageUpload == null) return;

    //collection ref
    const imageRef = ref(
      storageService,
      `${authService.currentUser.uid}/${imageUpload.name}`
    );
    await uploadBytes(imageRef, imageUpload).then(() =>
      alert("이미지 업로드 완료!")
    );

    const downloadURL = await getDownloadURL(imageRef);
    console.log(downloadURL);

    //
    setDownloadURL(downloadURL);
  };

  //

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
          />
          {/* ----------------------------------------------- */}
          <label>품목 가격</label>
          <input
            type="text"
            placeholder="숫자로만 입력해 주세요 ex) 18000 "
            value={itemPriceText}
            onChange={(event) => {
              const value = event.target.value;
              const onlyNumberValue = Number(value.replaceAll(",", ""));
              setItemPriceText(onlyNumberValue.toLocaleString());
            }}
          />
          {/* ----------------------------------------------- */}
          <label>품목 사진</label>
          <input
            type="file"
            onChange={(event) => {
              setImageUpload(event.target.files[0]);
            }}
          />
          <button onClick={uploadImage}>Upload</button>
          {/* ----------------------------------------------- */}
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
`;

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
`;
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
`;
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
`;

export default AddContents;
