import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  collection,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { dbService, storageService, authService } from "fbase";
import { useDispatch, useSelector } from "react-redux";
import { fetchContents } from "redux/modules/contents";
import { getDownloadURL, ref, listAll } from "firebase/storage";
import { styled } from "styled-components";
import Login from "components/authentication/Login";

const PreviewContentsList = () => {
  //(리듀서에서 가져옴)
  const currentUser = useSelector((state) => state.auth.user);
  const contents = useSelector((state) => state.contents);

  //
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //
  const { contentsId } = useParams();
  console.log("contentsId => ", contentsId);
  const targetContent = contents.find((item) => item.id === contentsId);
  console.log("targetContent => ", targetContent);

  //Usestates
  const [imageUpload, setImageUpload] = useState(null);
  const [imageList, setImageList] = useState([]);
  // const [images, setImageUpload] = useState([]);
  // const [imageUpload, setimageUpload] = useState("");

  //❷Read
  // 1. 게시글 불러오기
  // *useEffect(()=>{}, [])로 인해, 메인페이지 처음 로드될 때는 fetchData()를 무조건 실행
  useEffect(() => {
    const fetchData = async () => {
      //collection ref + queries
      const colRef = collection(dbService, "contents");
      //queries
      const q = query(colRef, orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const contents_list = [];

      querySnapshot.forEach((doc) => {
        const data = { id: doc.id, ...doc.data() }; // doc.data()를 실행하면 해당 document의 데이터를 가져올 수 있음

        console.log("2. getDocs로 내려지는 데이터 =>", data);
        contents_list.push(data);
      });

      dispatch(fetchContents(contents_list));
      // 2.상세페이지에서 리듀서 업데이트 하는 부분을 주석처리했는데도 fB 업데이트뿐만 아니라 화면 업데이트도 되는 이유는, fetchContents(contents_list)가 화면 로드시 실행되어서.
    };

    //fetchData() 호출해서, DB 데이터 클라이언트쪽으로 가져오기
    fetchData();
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  //"새로운 결재 요청하기" (게시글 등록 버튼)
  //<Link to={"/contentsForm"}>새로운 결제 요청하기</Link>를 버튼으로 리팩토링
  const onAddContentsClick = () => {
    if (currentUser) {
      navigate("/contentsForm");
    } else {
      alert("로그인 해주세요!");
      // 로그인 창 띄우기 추가
    }
  };

  //"결재 검토하기" (게시글별 댓글 확인 버튼)
  // <Link to={`/detail/${contents.id}`}>결재하기</Link>;를 버튼으로 리팩토링하려고 하는데 안되네

  const onCommentClick = (contentId) => {
    if (currentUser) {
      console.log(contentId);
      // console.log("댓글 보려면 로그인 해야 함 => ", currentUser);
      // console.log("contents의 값(배열/객체 확인용) => ", contents);
      // console.log("...contents의 값(배열/객체 확인용) => ", ...contents);
      // console.log("contents.id의 값 => ", contents.id); //현재 contents는 객체가 아닌 배열인데, 속성값에 직접 접근하려다보니 undefined가 나는 것

      // navigate(`/detail/${contents.id}`);
      navigate(`/detail/${contentId}`);
      // navigate(`/detail/${targetContent.id}`);
      // navigate("/detail/:contentsId");
    } else {
      alert("로그인 해주세요!");
      // 로그인 창 띄우기 추가
    }
  };

  //--------------------------------------------------------------------------//
  return (
    <Container>
      <NewContentButton onClick={onAddContentsClick}>
        새로운 결재 요청하기
      </NewContentButton>
      <ul>
        {/* 가져온 DB data 클라이언트쪽에 보여주기 */}
        {contents.map((content) => {
          return (
            <ContentsList>
              <ContentPreview key={content?.id}>
                <p>
                  <span>{content.contentsDate}</span> 결재요청건
                </p>
                <img src={content.downloadURL} alt="이미지 없음" />
                <p>
                  결재 품목 :{" "}
                  <span>
                    {content.wishItemText} ({content.itemPriceText})원에 대한
                    결재요청건이 있습니다.
                  </span>
                </p>

                <p>결재를 검토하시겠습니까?</p>
                <DetailContentButton to={`/detail/${content.id}`}>
                  결재 검토하기
                </DetailContentButton>
              </ContentPreview>
            </ContentsList>
          );
        })}
      </ul>
      <TopButton onClick={handleScrollToTop}> ▲ </TopButton>
    </Container>
  );
};

const Container = styled.section`
  padding-top: 150px;
  width: 60%;
  margin: 0 auto;
  text-align: center;
`;

const NewContentButton = styled.button`
  display: inline-block;
  width: 250px;
  height: 50px;
  margin-bottom: 50px;

  font-size: 20px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 50px;
  text-align: center;

  border-radius: 25px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #5aceb1;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #39c4a1;
    color: #fff;
  }
`;

const ContentsList = styled.li`
  &:last-child {
    margin-bottom: 100px;
  }
`;

const ContentPreview = styled.div`
  padding: 30px 50px;
  margin-bottom: 50px;

  border-radius: 30px;
  background-color: aliceblue;

  box-shadow: 5px 5px 10px #eee;

  transition: 0.2s;

  &:hover {
    transform: scale(1.03);
  }

  & > p {
    margin-bottom: 20px;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: -0.7px;
  }

  & > p:first-child {
    margin-bottom: 40px;
    font-size: 22px;
    font-weight: 600;
  }
  & > p:nth-child(7) {
    margin-bottom: 50px;
  }

  & > p > span {
    margin-left: 5px;
    font-size: 19px;
    font-weight: 600;
    color: #244eaa;
  }

  & > img {
    width: 300px;
    height: auto;
    border-radius: 10px;
    margin-bottom: 30px;
  }
`;

const DetailContentButton = styled(Link)`
  display: inline-block;
  width: 150px;
  height: 40px;

  font-size: 16px;
  font-weight: 500;
  letter-spacing: -0.4px;
  line-height: 40px;
  text-align: center;

  border-radius: 20px;
  box-shadow: 3px 3px 5px #ddd;

  background-color: #4c6db6;
  color: #fff;

  transition: 0.2s;

  &:hover {
    transform: scale(1.05);
    background-color: #2950a3;
    color: #fff;
  }
`;

const TopButton = styled.button`
  position: fixed;
  bottom: 50px;
  right: 5%;

  width: 60px;
  height: 60px;

  border-radius: 50%;
  box-shadow: 3px 3px 3px #acaf6d;

  font-size: 25px;
  font-weight: 800;
  line-height: 55px;

  background-color: #f8e9a5;
  color: #c2a421;

  transition: 0.2s;

  &:hover {
    transform: scale(1.1);
    background-color: #f1df8f;
  }
`;

export default PreviewContentsList;
