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

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [loading, setLoading] = useState(false); // not good UI
  // ✅ Separate loading state for each button
  const [emailLoading, setEmailLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const [loginForm, setLoginForm] = useState(false);
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  async function signupWithEmail() {
    if (!validateSignupFields()) return;
    setEmailLoading(true); // ✅ only email button loads
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;
      await createDoc(user);
      toast.success("User Created Successfully!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false); // ✅ only email button stops
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }

  async function loginWithEmail() {
    if (!email || !password) {
      toast.error("Both fields are required");
      return;
    }
    setEmailLoading(true); // ✅ only email button loads
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Login Successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setEmailLoading(false); // ✅ only email button stops
    }
  }

  function toggleForm() {
    setLoginForm(!loginForm);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  async function createDoc(user) {
    setLoading(true);
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
        toast.success("Doc created");
        setLoading(false);
      } catch (err) {
        toast.error(err.message);
        setLoading(false);
      }
    } else {
      toast.error("Doc already exits");
      setLoading(false);
    }
  }

  async function googleAuth() {
    setGoogleLoading(true); // ✅ only google button loads
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createDoc(user);
      toast.success("Logged in Successfully");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setGoogleLoading(false); // ✅ only google button stops
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
            <Input
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="rushikeshsisode@gmail.com"
              type="email"
            />
            <br />
            <Input
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example123"
              type="password"
            />
            <br />
            // ✅ Each button uses its own loading state
            <CustomButton
              text={
                emailLoading ? "Loading..." : "Signup Using Email and Password"
              }
              onClick={(e) => {
                e.preventDefault();
                signupWithEmail();
              }}
              disabled={emailLoading || googleLoading} // ✅ disable both during any operation
            />
            <p className="or">or</p>
            <CustomButton
              text={googleLoading ? "Loading..." : "Signup Using Google"}
              blue
              onClick={(e) => {
                e.preventDefault();
                googleAuth();
              }}
              disabled={emailLoading || googleLoading} // ✅ disable both during any operation
            />
            <p className="altpara">
              Don’t have an account?{" "}
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
            <Input
              label="Full Name"
              state={name}
              setState={setName}
              placeholder="Rushikesh Sisode"
            />
            <br />
            <Input
              label="Email"
              state={email}
              setState={setEmail}
              placeholder="rushikeshsisode@gmail.com"
              type="email"
            />
            <br />
            <Input
              label="Password"
              state={password}
              setState={setPassword}
              placeholder="Example123"
              type="password"
            />
            <br />
            <Input
              label="Confirm Password"
              state={confirmPassword}
              setState={setConfirmPassword}
              placeholder="Example123"
              type="password"
            />
            <br />
            <CustomButton
              text={loading ? "Loading..." : "Signup Using Email and Password"}
              onClick={(e) => {
                e.preventDefault();
                signupWithEmail();
              }}
              disabled={loading}
            />
            <p className="or">or</p>
            <CustomButton
              text={loading ? "Loading..." : "Signup Using Google"}
              blue
              onClick={(e) => {
                e.preventDefault();
                googleAuth();
              }}
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
