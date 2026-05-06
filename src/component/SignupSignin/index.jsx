import React, { useState } from 'react';
import './style.css';
import Input from '../Input';
import CustomButton from '../CustomButton';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from "firebase/firestore"; 
import { db } from '../../firebase';     

const SignupSignin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState(false); 
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();

  function signupWithEmail() { 
    setLoading(true);
    if (!name || !email || !password || !confirmPassword) {
      toast.error("All fields are mandatory");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        toast.success("User Created Successfully!");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        createDoc(user);
        navigate('/dashboard')
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  }

  function loginWithEmail() {
    setLoading(true);
    if (!email || !password) {
      toast.error("Both fields are required");
      setLoading(false);
      return;
    }
    console.log(email);
    console.log(password);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log("Logged in user:", user);
        toast.success("Login Successful!");
         navigate('/dashboard')
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => setLoading(false));
  }

  function toggleForm() {
    setLoginForm(!loginForm);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  async function createDoc(user){
    setLoading(true);
    if(!user) return;

    const userRef=doc(db,'users',user.uid);
    const userData=await getDoc(userRef);

    if(!userData.exists()){
    try{
      await setDoc(doc(db, "users", user.uid), {
        name:user.displayName ? user.displayName:name,
        email:user.email,
        photoURL:user.photoURL?user.photoURL:"",
        createdAt:new Date(),
      });
      toast.success("Doc created")  
      setLoading(false);
    }catch(err){
      toast.error(err.message)
      setLoading(false);
    }
  }else{
    toast.error("Doc already exits")
    setLoading(false);
  }
}

async function googleAuth() {
  setLoading(true);
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    await createDoc(user);
    toast.success("Logged in Successfully");
    navigate('/dashboard');

  } catch (error) {
    toast.error(error.message); // ✅ fixed: .message extracts the string
  } finally {
    setLoading(false); // ✅ always runs, whether success or error
  }
}

  return (
    <>
      { loginForm ? (
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

            <CustomButton
              text={loading ? "Loading..." : "Login with Email and Password"}
              onClick={(e) => {
                e.preventDefault();
                loginWithEmail();
              }}
              disabled={loading}
            />
            <p className="or">or</p>
            <CustomButton
              text={loading ? "Loading..." : "Login with Google"}
              blue
                onClick={(e)=>{
                e.preventDefault();
                googleAuth();
              }}
            />
            <p className="altpara">
              Don’t have an account?{" "}
              <button
                type="button"
                className="clickme"
                onClick={toggleForm}
              >
                Click Here
              </button>
            </p>
          </form>
        </div>
      ) : (
        
        
        <div className="signup-wrapper">
          <h2 className="title">
            Sign Up on <span style={{ color: "var(--theme)" }}>TrackMyFunds.</span>
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
               onClick={(e)=>{
                e.preventDefault();
                googleAuth();
              }}
            />

            <p className="altpara">
              Already have an account?{" "}
              <button
                type="button"
                className="clickme"
                onClick={toggleForm}
              >
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





