import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, updateDoc } from "firebase/firestore";
import { dbService } from "fbase";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "redux/modules/contents";

const PreviewContentsList = () => {
  //(리듀서에서 가져옴)
  const contents = useSelector((state) => state.contents);

  //
  const dispatch = useDispatch();

  //❷Read
  // 1.useEffect(()=>{}, [])로 인해, 메인페이지 처음 로드될 때는 fetchData()를 무조건 실행
  useEffect(() => {
    const fetchData = async () => {
      //
      const q = query(collection(dbService, "contents"));
      const querySnapshot = await getDocs(q);

      const contents_list = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }; // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있음

        console.log("2. getDocs로 내려지는 데이터 =>", data);
        contents_list.push(data);
      });

      dispatch(fetchContents(contents_list));

      // 2.상세페이지에서 리듀서 업데이트 하는 부분을 주석처리했는데도 fB 업데이트뿐만 아니라 화면 업데이트도 되는 이유는, fetchContents(contents_list)가 화면 로드시 실행되어서.

      // dispatch(
      //   {
      //     type: FETCH_CONTENTS,
      //     payload: contents_list
      //   }
      // )
    };

    //fetchData() 호출해서, DB 데이터 클라이언트쪽으로 가져오기
    fetchData();
  }, []);

  // []을 안해주면 메인페이지는 무한로딩이 될 것.

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

        {/* 가져온 DB data 클라이언트쪽에 보여주기 */}
        {contents.map((content) => {
          return (
            <li
              style={{ border: "solid", marginTop: "20px", padding: "20px" }}
              key={content?.id}
            >
              <div>
                {/* <p>{} 결제 요청건</p> */}
                <p>결제 품목: {content.wishItemText}</p>
                <p>가격: {content.itemPriceText}</p>
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
