import React, { useState } from "react";

function Counter() {
  // 총합
  const [count, setCount] = useState(0);
  // 입력값
  const [inputValue, setInputValue] = useState(0);

  const handleChange = (e) => {
    setInputValue(Number(e.target.value)); // input number값은 문자열이므로 숫자로 변환
  };

  const handleClick = () => {
    setCount(count + inputValue);
  };

  const clearClick = () => {
    setCount(0);
    setInputValue(0);
  };

  return (
    <div className="counter">
      <h1>누적 값 계산기</h1>
      <input type="number" value={inputValue} onChange={handleChange}></input>
      <button className="plus-btn" onClick={handleClick}>
        더하기
      </button>
      <p>누적 값: {count}</p>
      <button className="reset-btn" onClick={clearClick}>
        초기화
      </button>
    </div>
  );
}

export default Counter;
