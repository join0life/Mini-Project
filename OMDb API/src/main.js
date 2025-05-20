const movie = document.querySelector(".movie");
const searchBtn = document.querySelector(".searchBtn");
const searchBox = document.querySelector(".searchBox");

// 검색 함수
function searchMovie() {
  const query = searchBox.value.trim();

  if (query === "") {
    alert("검색어를 입력하세요.");
    return;
  }

  fetch(
    // encodeURIComponent : 특수문자, 공백 등 다 포함해 URL 인코딩
    `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=6033ada6`
  )
    .then((res) => res.json())
    .then((data) => {
      let convertedTo5 = null;
      let starsHTML = "";

      // 별점 가져오기
      const imdbRating = data.Ratings.find(
        (r) => r.Source === "Internet Movie Database"
      ); // "Ratings":[{"Source":"Internet Movie Database","Value":"7.6/10"},{"Source":"Rotten Tomatoes","Value":"98%"}, ....

      if (imdbRating) {
        const ratingValue = parseFloat(imdbRating.Value.split("/")[0]);
        convertedTo5 = ratingValue / 2; // 5점 만점 기준으로 변환
        starsHTML = renderStars(convertedTo5); // renderStars() : 별점을 svg 이미지로 바꾸는 함수
      }

      // Response : API 공식 문서에 포함
      if (data.Response === "True") {
        movie.innerHTML = `
        <div class="rating-area">
          <div class="rating-num">${starsHTML}</div>
          <div class="rating">${convertedTo5} / 5</div>
        </div>
        <div class="movie-poster">
          <img src="${data.Poster}" alt="movie poster" />
        </div>
        <div class="movie-content">
          <ul class="movie-content">
            <li><b>제목</b>: ${data.Title}</li>
            <li><b>개봉 년도</b>: ${data.Year}</li>
            <li><b>장르</b>: ${data.Genre}</li>
            <li><b>플롯</b>: ${data.Plot}</li>
          </ul>
        </div>
      `;
      } else {
        movie.innerHTML = `<p>${data.Error}</p>`; // 요청 실패 시 에러 메시지 출력
      }
    })
    .catch((err) => console.log("호출 에러: " + err));
}

// 검색 버튼 클릭시 검색 함수 호출
searchBtn.addEventListener("click", searchMovie);

// 엔터시 검색 함수 호출
searchBox.addEventListener("keypress", (e) => {
  if (e.key == "Enter" && !e.isComposing) {
    // !e.isComposing : 한글 조합 중 엔터 방지용
    searchMovie();
  }
});

// 별점 호출 코드
function renderStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating - fullStars >= 0.5;
  const totalStars = fullStars + (halfStar ? 1 : 0);
  let starsHTML = "";

  for (let i = 0; i < fullStars; i++) {
    starsHTML += getStarSVG("full");
  }
  if (halfStar) {
    starsHTML += getStarSVG("half");
  }
  for (let i = totalStars; i < 5; i++) {
    starsHTML += getStarSVG("empty");
  }
  return starsHTML;
}

// 별점 추가 코드
function getStarSVG(type) {
  if (type === "full") {
    return `<svg width="20" height="20" viewBox="0 0 20 20" fill="#facc15" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.561-.955L10 0l2.95 5.955 6.561.955-4.755 4.635 1.122 6.545z"/>
    </svg>`;
  }
  if (type === "half") {
    return `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stop-color="#facc15"/>
          <stop offset="50%" stop-color="#e5e7eb"/>
        </linearGradient>
      </defs>
      <path fill="url(#half)" d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.561-.955L10 0l2.95 5.955 6.561.955-4.755 4.635 1.122 6.545z"/>
    </svg>`;
  }
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="#e5e7eb" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 15l-5.878 3.09 1.122-6.545L.489 6.91l6.561-.955L10 0l2.95 5.955 6.561.955-4.755 4.635 1.122 6.545z"/>
  </svg>`;
}
