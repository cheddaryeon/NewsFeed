import { BrowserRouter, Route, Routes } from "react-router-dom";
import Main from "pages/Main";
import Detail from "pages/Detail";
import MyProfile from "pages/MyProfile";
import Header from "components/ui/Header";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/:contentsId" element={<Detail />} />
        <Route path="/:UserId" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
