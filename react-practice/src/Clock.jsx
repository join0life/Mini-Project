import React, { useState, useEffect } from "react";

function Clock() {
  const [time, setTime] = useState(new Date());

  // setInterval하기 위해 useEffect를 사용
  useEffect(() => {
    // 1초마다 현재 시간 업데이트
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    // 컴포넌트 언마운트 시 인터벌 제거
    // 마운트: 컴포넌트가 처음 화면에 나타날 때
    // 언마운트: 컴포넌트가 화면에서 사라질 때
    return () => clearInterval(intervalId);
  }, []);

  // 시/분/초 형식으로 출력
  const formatted = time.toLocaleTimeString();

  return (
    <div className="clock">
      <h1>현재 시간</h1>
      <p>{formatted}</p>
    </div>
  );
}

export default Clock;
