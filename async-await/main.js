import { getTxtData, getJsonData } from "./api.js";

const txtBtn = document.querySelector(".txtBtn");
const jsonBtn = document.querySelector(".jsonBtn");
const txtResult = document.querySelector(".txtResult");
const jsonResult = document.querySelector(".jsonResult");

txtBtn.addEventListener("click", async () => {
  try {
    const data = await getTxtData();
    txtResult.textContent = data;
  } catch (e) {
    txtResult.textContent = "Error: " + e.message;
  }
});

jsonBtn.addEventListener("click", async () => {
  try {
    const data = await getJsonData();
    jsonResult.innerHTML = `
    <p>이름: ${data.name}</p>
    <p>직업: ${data.job}</p>
    <p>스킬: ${data.skills}</p>
    <p>깃허브 주소: <a href="${data.github}" target="_blank">${data.github}</a></p>
    <p>메시지: ${data.message}</p>
    `;
  } catch (e) {
    jsonResult.textContent = "Error: " + e.message;
  }
});
