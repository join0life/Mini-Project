import React, { useState } from "react";

// Greeting 컴포넌트
function Greeting() {
  // 입력 필드 상태
  const [name, setName] = useState("");
  // 출력 필드 상태
  const [greetMessage, setGreetMessage] = useState("");

  const handleClick = () => {
    const trimmed = name.trim();

    if (trimmed === "") {
      setGreetMessage("안녕하세요, 게스트님!");
    } else {
      setGreetMessage(`안녕하세요, ${trimmed}님!`);
    }

    setName("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      handleClick();
    }
  };

  return (
    <>
      <div className="greeting">
        <h1>만나서 반가워요!</h1>
        <input
          type="text"
          value={name}
          placeholder="이름을 입력하세요"
          onKeyDown={handleKeyDown}
          onChange={(e) => setName(e.target.value)}
        ></input>
        <button onClick={handleClick} className="ipt-btn">
          확인
        </button>
        <p>{greetMessage}</p>
      </div>
    </>
  );
}

export default Greeting;
