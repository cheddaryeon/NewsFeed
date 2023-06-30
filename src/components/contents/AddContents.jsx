import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db, dbService } from "fbase";
import { useDispatch } from "react-redux";
import { addContents, fetchContents } from "redux/modules/contents";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  //
  const onClickHandler = async (event) => {
    //
    event.preventDefault();

    //
    const newContents = {
      wishItemText,
      itemPriceText,
      wishReasonText,
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

    //
    navigate("/");
  };

  //------------------------------------------------//

  return (
    <div className="container" style={{ border: "solid" }}>
      <header>결제 요청 작성</header>

      <form>
        결제 품목:
        <input
          type="text"
          value={wishItemText}
          onChange={(event) => {
            const { value } = event.target;
            setWishItemText(value);
          }}
        />{" "}
        <br />
        품목 가격:
        <input
          type="text"
          value={itemPriceText}
          onChange={(event) => {
            const { value } = event.target;
            setItemPriceText(value);
          }}
        />{" "}
        <br />
        <button>이미지 업로드☒</button> <br />
        요청 사유:
        <textarea
          value={wishReasonText}
          onChange={(event) => {
            const { value } = event.target;
            setWishReasonText(value);
          }}
          placeholder="해당 물품의 결제를 희망하는 이유를 알려주세요 :)"
        />
        <button>취소</button>
        <button onClick={onClickHandler}>등록</button>
      </form>
    </div>
  );
};

export default AddContents;
