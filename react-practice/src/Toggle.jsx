import React, { useState } from "react";

function Toggle() {
  const [isOn, setIsOn] = useState(false);

  const handleClick = () => {
    setIsOn(!isOn); // true는 false로, false는 true로 전환
  };

  return (
    <div className="toggle">
      <h1>상태 버튼</h1>
      <p>현재 상태: {isOn ? "on" : "off"}</p>
      <button onClick={handleClick}>상태 바꾸기</button>
    </div>
  );
}

export default Toggle;
