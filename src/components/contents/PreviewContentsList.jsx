import React from "react";

function PreviewContentsList() {
  return (
    <div className="wrapper" style={{ border: "solid" }}>
      <header>
        <button>새로운 결제 요청하기</button>
        <div>
          <p>2023.06.27 결제 요청건</p>
          <p>결제요청자: 언럭키세븐</p>
          <p>결제 품목: 이어폰(20,000원)에 대한 결제요청건이 있습니다.</p>
        </div>
        <div>
          <p>결제를 검토하시겠습니까?</p>
          <button>결제 검토하기</button>
        </div>
      </header>
    </div>
  );
}

export default PreviewContentsList;
