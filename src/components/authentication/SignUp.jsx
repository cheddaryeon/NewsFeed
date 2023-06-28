import { authService } from "fbase";
import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import SignUpForm from "./SignUpForm";

const SignUp = () => {
  const onSocialClick = async (e) => {
    const { target: { name } } = e;
    let provider;
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
      }
      await signInWithPopup(authService, provider);
    }
    catch (error) {
      console.log("Caught error Popup closed", error);
    }
  };

    return (
      <>
        <SignUpForm />
        <div>
          <span>다른 방법으로 가입하기</span>
          <button onClick={onSocialClick} name="google">Continue with Google</button>
        </div>
      </>
    );
  };


export default SignUp;