import React from "react";
import "./loading.css";

const Loading = ({ loading }) => {
  if (!loading) return null;

  return (
    <div className="loading-container">
      <div className="loader"></div>
    </div>
  );
};

export default Loading;
