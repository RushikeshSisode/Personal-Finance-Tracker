import React, { useState } from "react";
import "./style.css";
import Input from "../Input";
import CustomButton from "../CustomButton";
import { toast } from "react-toastify";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

// ✅ outside component - created once
const provider = new GoogleAuthProvider();

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();

  function validateSignupFields() {
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are mandatory");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    return true;
  }

  async function signupWithEmail() {
    if (!validateSignupFields()) return;
    setEmailLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await createDoc(user);
      toast.success("User Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
      setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
    }
  }

  async function loginWithEmail() {
    if (!email || !password) {
      toast.error("Both fields are required");
      return;
    }
    setEmailLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false);
    }
  }

  function toggleForm() {
    setLoginForm(!loginForm);
    setName(""); setEmail(""); setPassword(""); setConfirmPassword("");
  }

  // ✅ no setLoading inside createDoc
  async function createDoc(user) {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: user.email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: new Date(),
        });
        toast.success("Account Created!");
      } catch (err) {
        toast.error(err.message);
      }
    } else {
      return;
    }
  }

  async function googleAuth() {
    setGoogleLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createDoc(user);
      toast.success("Logged in Successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Login <span style={{ color: "var(--theme)" }}>TrackMyFunds.</span>
          </h2>
          <form>
            <Input label="Email" state={email} setState={setEmail}
              placeholder="example@gmail.com" type="email" />
            <br />
            <Input label="Password" state={password} setState={setPassword}
              placeholder="Example123" type="password" />
            <br />
            {/* ✅ Login buttons with correct text and separate loading */}
            <CustomButton
              text={emailLoading ? "Loading..." : "Login with Email and Password"}
              onClick={(e) => { e.preventDefault(); loginWithEmail(); }}
              disabled={emailLoading || googleLoading}
            />
            <p className="or">or</p>
            <CustomButton
              text={googleLoading ? "Loading..." : "Login with Google"}
              blue
              onClick={(e) => { e.preventDefault(); googleAuth(); }}
              disabled={emailLoading || googleLoading}
            />
            <p className="altpara">
              Don't have an account?{" "}
              <button type="button" className="clickme" onClick={toggleForm}>
                Click Here
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on{" "}
            <span style={{ color: "var(--theme)" }}>TrackMyFunds.</span>
          </h2>
          <form>
            <Input label="Full Name" state={name} setState={setName}
              placeholder="Your Name" />
            <br />
            <Input label="Email" state={email} setState={setEmail}
              placeholder="example@gmail.com" type="email" />
            <br />
            <Input label="Password" state={password} setState={setPassword}
              placeholder="Min 6 characters" type="password" />
            <br />
            <Input label="Confirm Password" state={confirmPassword}
              setState={setConfirmPassword} placeholder="Repeat password" type="password" />
            <br />
            {/* ✅ Signup buttons with correct text and separate loading */}
            <CustomButton
              text={emailLoading ? "Loading..." : "Signup Using Email and Password"}
              onClick={(e) => { e.preventDefault(); signupWithEmail(); }}
              disabled={emailLoading || googleLoading}
            />
            <p className="or">or</p>
            <CustomButton
              text={googleLoading ? "Loading..." : "Signup Using Google"}
              blue
              onClick={(e) => { e.preventDefault(); googleAuth(); }}
              disabled={emailLoading || googleLoading}
            />
            <p className="altpara">
              Already have an account?{" "}
              <button type="button" className="clickme" onClick={toggleForm}>
                Click Here
              </button>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default SignupSignin;