//346*1080
import "./LNB.css";
import { Link, useLocation } from "react-router-dom";
import React from "react";

const LNB = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="LNB">
      <div className="list-wrapper">
        <Link to="/" className={currentPath === "/" ? "selected" : ""}>
          <div>📋 여행 계획표</div>
        </Link>
        <Link
          to="/calendar"
          className={currentPath === "/calendar" ? "selected" : ""}
        >
          <div>📆 캘린더</div>
        </Link>
      </div>
    </div>
  );
};

export default React.memo(LNB);
