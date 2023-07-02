import React, { useEffect, useState } from "react";
import { addDoc, collection, getDocs, query } from "firebase/firestore";
import { db } from "fbase";
import AddContents from "components/contents/AddContents";

const ContentsForm = () => {
  return (
    <div>
      <AddContents />
    </div>
  );
};

export default ContentsForm;
