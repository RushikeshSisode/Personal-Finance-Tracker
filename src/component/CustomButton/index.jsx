import React from "react";
import "./style.css";

const CustomButton = ({ text, children, onClick, blue, disabled }) => {
  
  return (
    <button
      disabled={disabled}
      className={blue ? "btn btn-blue" : "btn"}
      onClick={onClick}
    >
      {text || children}
    </button>
  );
};

export default CustomButton;
