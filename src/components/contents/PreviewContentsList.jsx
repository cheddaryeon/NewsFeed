import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "redux/modules/contents";

const PreviewContentsList = () => {
  //
  const contents = useSelector((state) => state.contents);

  //
  const dispatch = useDispatch();

  //❷Read
  useEffect(() => {
    const fetchData = async () => {
      //
      const q = query(collection(dbService, "contents"));
      const querySnapshot = await getDocs(q);

      console.log({ querySnapshot });

      const contents_list = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }; // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있음

        console.log("콘솔1", data);
        contents_list.push(data);
      });

      dispatch(fetchContents(contents_list));
      console.log({ contents_list });

      // dispatch(
      //   {
      //     type: FETCH_CONTENTS,
      //     payload: contents_list
      //   }
      // )
    };

    fetchData();
  }, []);

  // //❸Update
  // const updateContents = async (event) => {
  //   //
  //   const contentsRef = doc(db, "contents", contents.id);
  //   await updateDoc(contentsRef, { ...contents, isDone: !contents.isDone });

  //   setContents((prev) => {
  //     return prev.map((element) => {
  //       if (element.id === contents.id) {
  //         return { ...element, isDone: !element.isDone };
  //       } else {
  //         return element;
  //       }
  //     });
  //   });

  //   //
  //   dispatch(
  //     {
  //       type: UPDATE_CONTENTS,
  //       payload: contents_list
  //     }
  //   )
  // };

  // //❹Delete

  //--------------------------------------------------------------------------//
  return (
    <div className="container" style={{ border: "solid", marginTop: "20px" }}>
      <header
        style={{
          border: "solid",
          marginTop: "20px",
          padding: "20px",
          backgroundColor: "lightgray",
        }}
      >
        <Link to={"/contentsForm"}>새로운 결제 요청하기</Link>
      </header>

      <ul className="PreviewListsWrapper">
        <li
          style={{
            border: "solid",
            marginTop: "20px",
            padding: "20px",
            backgroundColor: "lightgray",
          }}
        >
          <div>
            <p>2023.06.26 결제 요청건</p>
            <p>결제요청자: 언럭키세븐</p>
            <p>결제 품목: 이어폰(20,000원)에 대한 결제요청건이 있습니다.</p>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>결제를 검토하시겠습니까?</p>
            <button>결제 검토하기</button>
          </div>
        </li>

        {/* 붙여넣기 시작 */}
        {contents.map((content) => {
          return (
            <li style={{ border: "solid", marginTop: "20px", padding: "20px" }}>
              <div key={content.id}>
                {/* <p>{} 결제 요청건</p> */}
                <p>결제요청자: {content.wishItemText}</p>
                <p>결제 품목: {content.itemPriceText}</p>
                <p>결제 요청 사유: {content.wishReasonText}</p>
              </div>
              <div style={{ marginTop: "20px" }}>
                <p>결제를 검토하시겠습니까?</p>
                {/* <Link to={"/detail/:contentsId"}>결제 검토하기</Link> */}
                <Link to={`/detail/${content.id}`}>결제 검토하기</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default PreviewContentsList;
