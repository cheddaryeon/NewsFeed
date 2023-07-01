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
              <MyContentsTitle to={`/detail/${content.id}`}>
                {content.wishItemText}
              </MyContentsTitle>
              <WriteDateTitle>{content.contentsDate}</WriteDateTitle>
            </MyConentsBox>
          ))}
        </MyContentsSection>
      ) : (
        <NoContentsTitle>등록된 게시물이 없습니다.</NoContentsTitle>
      )}
    </>
  );
};

export default MyContents;

const MyContentsSection = styled.section`
  width: 100%;
  padding: 30px;
`

const MyConentsBox = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;

  width: 100%;
  padding: 10px 0;

  border-radius: 20px;

  font-size: 14px;
  
  &::after{
    content: "";
    position: absolute;
    top: 40px;

    display: block;
    width: 435px;
    height: 1px;
    background-color: #eee;
  }

  &:last-of-type::after {
    width: 0px;
  }
`;

const MyContentsTitle = styled(Link)`
  display: inline-block;
  width: 60%;
  font-weight: 500;
  text-align: left;
  
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  color: #3ac4a1;

&:hover {
  color: #23ac89;
  text-decoration: underline;
}
`;

const WriteDateTitle = styled.p`
  flex-shrink: 0;
  width: 35%;
  font-size: 13px;
  text-align: right;
`

const NoContentsTitle = styled.p`
  padding: 30px;
`