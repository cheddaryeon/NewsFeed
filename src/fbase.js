import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  // 환경변수에 실제 Key값 넣어놓고 숨기기
  // 완벽하게 숨겨지는 것은 아님 -> react가 web에서 실행되면 결국 노출은 되지만
  // key값을 직접적으로 github에 업로드 하고 싶지 않아서 환경변수 설정해줌
  apiKey: "AIzaSyBhNL0y3cizqTqTHJvzILnaeCiErASDSTM",
  authDomain: "buy-or-not2-ddaec.firebaseapp.com",
  projectId: "buy-or-not2-ddaec",
  storageBucket: "buy-or-not2-ddaec.appspot.com",
  messagingSenderId: "677238433519",
  appId: "1:677238433519:web:70b3bd73226a614f321d1a",
};

// Initialize Firebase
// export const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export default app;

// auth, firestore, storage 사용하겠다고 선언
// 필요한 곳에서 import해서 해당 기능 API와 함께 사용하면 됨!
// ex) 로그인 기능을 구현하려고 한다면
// 로그인 기능 컴포넌트에서 import {getAuth, auth관련API} from "firebase/auth";
export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
