import { BrowserRouter, Route, Routes } from "react-router-dom";
//
import Main from "pages/Main";
import ContentsForm from "pages/ContentsForm";
import Detail from "pages/Detail";
import MyProfile from "pages/MyProfile";
import Header from "components/ui/Header";

const Router = () => {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/contentsForm" element={<ContentsForm />} />
        <Route path="/detail/:contentsId" element={<Detail />} />
        <Route path="/profile/:userId" element={<MyProfile />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
