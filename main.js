import { getWeatherData } from "./axiosAPI.js";

const searchBtn = document.querySelector("#search-btn");
const searchBox = document.querySelector(".search-box");
const searchBoxContainer = document.querySelector(".search-box-container");
const city = document.querySelector(".city");
const main = document.querySelector(".main");
const tomorrow = document.querySelector(".tomorrow");
const dayAfterTomorrow = document.querySelector(".day-after-tomorrow");
const threeDaysLater = document.querySelector(".three-days-later");
const today = document.querySelector(".today");

// 검색 버튼 누르면 검색 토글 등장
searchBtn.addEventListener("click", () => {
  if (getComputedStyle(searchBoxContainer).display === "none") {
    searchBoxContainer.style.display = "block";
    searchBox.focus();
  } else {
    // 검색 토글이 열려있을 때 버튼 클릭하면
    searchBoxContainer.style.display = "none";
  }
});

// 엔터시 검색(input 요소에서만 제대로 동작)
searchBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.isComposing) {
    searchBox.blur(); // 포커스 제거 + 키보드 내림
    window.scrollTo(0, 0); // 화면 위치 복원
    setTimeout(() => {
      searchCity();
    }, 100); //키보드 내리는 데 약간 시간 줌
  }
});

// 검색 함수
async function searchCity() {
  try {
    const query = searchBox.value.trim();

    if (query === "") {
      alert("도시명을 입력해주세요.");
      return;
    } else {
      searchBoxContainer.style.display = "none"; // 검색 토글 닫기
      searchBox.value = ""; // 검색창 초기화
    }

    // API 복구되면 해제
    const data = await getWeatherData(query);

    // 실제 API 대신 일단 이걸 사용
    // const mockData = {
    //   city: "Seoul",
    //   currentWeather: "☁",
    //   currentTemp: 19,
    //   dailyWeather: ["☁", "⛆", "☀"],
    //   dailyTemp: [19, 17, 22],
    // };
    // 일단 mockData 쓰고, API 오류 해결되면 getWeatherData(query) 가져오기
    // const USE_MOCK = true;
    // const data = USE_MOCK ? mockData : await getWeatherData(query);

    const labels = getDateLabels(); // 날짜 함수에서 날짜 배열 가져오기

    city.textContent = data.city;
    today.textContent = "TODAY";
    main.innerHTML = `
    <div>
      <img class="main weather" src=${data.currentWeather} alt="메인 날씨 아이콘" />
    </div>
    <div class="main temp">${data.currentTemp}°</div>
    `;
    tomorrow.innerHTML = `
    <p class="day">${labels[0]}</p>
    <div class="sub">
      <div class="sub temp">${data.dailyTemp[0]}°</div>
      <div>
        <img class="sub weather" src=${data.dailyWeather[0]} alt="서브 날씨 아이콘" />
      </div>
    </div>
    `;
    dayAfterTomorrow.innerHTML = `
    <p class="day">${labels[1]}</p>
    <div class="sub">
      <div class="sub temp">${data.dailyTemp[1]}°</div>
      <div>
        <img class="sub weather" src=${data.dailyWeather[1]} alt="서브 날씨 아이콘" />
      </div>
    </div>
    `;
    threeDaysLater.innerHTML = `
    <p class="day">${labels[2]}</p>
    <div class="sub">
      <div class="sub temp">${data.dailyTemp[2]}°</div>
      <div>
        <img class="sub weather" src=${data.dailyWeather[2]} alt="서브 날씨 아이콘" />
      </div>
    </div>
    `;

    // border-bottom 생성
    tomorrow.classList.add("border-bottom");
    dayAfterTomorrow.classList.add("border-bottom");
  } catch (e) {
    if (e.response) {
      console.log("상태 코드: " + e.response.status);
      console.log("에러 메시지:", JSON.stringify(e.response.data, null, 2));
      // 모달 or 커스텀 메시지 박스로 수정
      alert(e.message);
    } else {
      console.log("리퀘스트 실패: " + e.message);
    }
  }
}

// 날짜 생성
function getDateLabels(count = 3) {
  const labels = [];
  const today = new Date(); // 오늘 날짜 객체 생성

  for (let i = 1; i <= count; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    if (i === 1) {
      labels.push("TOMORROW"); // 내일
    } else {
      const options = { weekday: "long" }; // 요일명 전체 이름으로 출력
      labels.push(date.toLocaleDateString("en-US", options).toUpperCase());
    }
  }
  return labels;
}
