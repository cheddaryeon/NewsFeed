import { useState, useEffect } from "react";
import { query, getDocs, collection, where, orderBy } from "firebase/firestore";
import { dbService } from "fbase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { styled } from "styled-components";

const MyContents = () => {
  const currentUser = useSelector((state) => state.auth.user);
  const [myContents, setMyContents] = useState([]);

  console.log("MyContents.jsx 현재 사용자 정보 => ", currentUser);

  const getMyContents = async () => {
    const q = query(
      collection(dbService, "contents"),
      where("contentsWriterId", "==", currentUser.userId),
      // firebase는 noSQL DB라서 pre-made query를 만들어주어야 함
      orderBy("contentsDate", "desc"),
    );
    
    const querySnapshot = await getDocs(q);
    const myContentsArr = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setMyContents(myContentsArr);
  }

  useEffect(() => {
    getMyContents();
  }, [])

  console.log("fb 서버에서 쿼리로 게시글 받아지는지 확인 => ", myContents)

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
              {content.contentsDate.toDate().toDateString()}
            </MyConentsBox>
          ))}
        </MyContentsSection>
      ) : (
        "등록된 게시물이 없습니다."
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

  width: 50%;

  border: 1px solid black;
  border-radius: 20px;
  margin: 10px;
  padding: 30px;

  transition: 0.2s;

  &:hover {
    text-decoration: underline;
    text-decoration-color: #3ac4a1;
  }
`;

const MyContentsTitle = styled.h3`
  color: #3ac4a1;
`;
