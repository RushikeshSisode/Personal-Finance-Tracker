import React from "react";
import "./style.css";
import { auth } from "../../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fallbackAvatar from "../../assets/userImg.svg"; // your fallback image

const Header = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await signOut(auth);
      toast.success("Logged Out Successfully");
      navigate("/");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="navbar">
      <p className="Logo">TrackMyFunds.</p>

      {user && (
        <div className="nav-right">
          <img
            src={user.photoURL ? user.photoURL : fallbackAvatar}
            alt="User Profile"
            className="user-avatar"
            referrerPolicy="no-referrer"
          />
          <button className="logout-btn" onClick={logoutHandler}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Header;
