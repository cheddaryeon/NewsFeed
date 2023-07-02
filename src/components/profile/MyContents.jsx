import { useEffect } from "react";
import { dbService } from "fbase";
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import { useSelector, useDispatch } from "react-redux";
import { setMyContents } from "redux/modules/myprofile";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const MyContents = () => {
  const dispatch = useDispatch();
  const myContents = useSelector((state) => state.myprofile.myContents)
  const currentUser = useSelector((state) => state.auth.user);
  // console.log("MyContents.jsx 현재 사용자 정보 => ", currentUser);

  // fb firestore 서버에서 내가 쓴 게시물 가져오기
  const getMyContentsQuery = async () => {
    const q = query(
      // firebase는 noSQL DB라서 pre-made query를 만들어줘야 함
      // 내가 쓴 글 where 조건문으로 필터링해서 query 생성
      collection(dbService, "contents"),
      where("contentsWriterId", "==", currentUser.userId),
      orderBy("contentsDate", "desc"),
    );
    
    const querySnapshot = await getDocs(q);
    const myContentsArr = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // 서버에서 불러온 내가 쓴 게시물 redux store에 저장
    dispatch(setMyContents(myContentsArr));
  }

  useEffect(() => {
    getMyContentsQuery();
  }, [myContents]);

  // console.log("fb 서버에서 쿼리로 게시글 받아지는지 확인 => ", myContents)

  return (
    <>
      {myContents.length > 0 ? (
        <MyContentsSection>
          {myContents.map((content) => (
            <MyConentsBox key={content.id}>
              <Link to={`/detail/${content.id}`}>
                <MyContentsTitle>
                  {content.wishItemText}
                </MyContentsTitle>
              </Link>
              {content.contentsDate}
            </MyConentsBox>
          ))}
        </MyContentsSection>
      ) : (
        <p>등록된 게시물이 없습니다.</p>
      )}
    </>
  );
};

export default MyContents;

const MyContentsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  margin-top: 30px;
`

const MyConentsBox = styled.div`
  display: flex;
  justify-content: space-between;

  width: 100%;

  border: 1px solid black;
  border-radius: 20px;
  margin: 10px;
  padding: 30px;
`;

const MyContentsTitle = styled.h3`
  color: #3ac4a1;
  transition: 0.2s;

&:hover {
  text-decoration: underline;
  text-decoration-color: #3ac4a1;
}
`;