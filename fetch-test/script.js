const btn = document.querySelector(".loadBtn");
const txtResult = document.querySelector(".txtResult");
const jsonResult = document.querySelector(".jsonResult");

btn.addEventListener("click", () => {
  // text 데이터 출력
  fetch("./data.txt")
    .then((res) => {
      if (!res.ok) throw new Error("네트워크 응답 오류");
      return res.text();
    })
    // textContent : 요소의 모든 텍스트(숨겨진 텍스트 포함, 태그 무시)를 읽거나 쓸 수 있음. HTML 태그는 무시됨.
    .then((data) => (txtResult.textContent = data))
    // 비동기 코드에서는 .then().catch()로 프로미스 체이닝
    .catch((e) => {
      txtResult.textContent = "Error: " + e.message;
    });

  // json 데이터 출력
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) throw new Error("네트워크 응답 오류");
      return res.json();
    })
    .then((data) => {
      jsonResult.innerHTML = `
      <p>이름: ${data.name}</p>
      <p>직업: ${data.job}</p>
      <p>스킬: ${data.skills}</p>
      <p>깃허브 주소: <a href="${data.github}" target="_blank">${data.github}</a></p>
      <p>메시지: ${data.message}</p>`;
    })
    .catch((e) => {
      jsonResult.textContent = "Error: " + e.message;
    });
});
