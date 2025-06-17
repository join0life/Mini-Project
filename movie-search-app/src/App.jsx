import { useState, useEffect } from "react";
import "./App.css";
import Media from "./Media.jsx";
import NavBar from "./NavBar.jsx";
import { getMediaData, getSearchData } from "./api.js";

function App() {
  const [type, setType] = useState("movie");
  const [randomPoster, setRandomPoster] = useState(null);
  const [searchResults, setSearchResults] = useState(null);

  const titlesByType = {
    movie: [
      "🎬 지금 상영 중",
      "🔥 인기 콘텐츠",
      "💎 명작 컬렉션",
      "✨ 개봉 예정작",
    ],
    tv: [
      "📺 오늘 방영하는 시리즈",
      "✨ 지금 방영 중",
      "🔥 인기 시리즈",
      "💎 명작 컬렉션",
    ],
  };

  const movieEndpoints = ["now_playing", "popular", "top_rated", "upcoming"];
  const tvEndpoints = ["airing_today", "on_the_air", "popular", "top_rated"];

  //검색 기능
  const handleSearch = async (query) => {
    if (!query) return;

    const { results } = await getSearchData({ query, type });
    setSearchResults(results);
  };

  const fetchRandomPoster = async () => {
    const endpoint = type === "movie" ? "now_playing" : "airing_today";
    const { results } = await getMediaData({ type, endpoint, page: 1 });
    const filtered = results.filter((item) => item.poster_path);
    const random = filtered[Math.floor(Math.random() * filtered.length)];
    setRandomPoster(random.poster_path);
  };

  const handleTypeChange = (newType) => {
    setType(newType);
    setSearchResults(null); // 검색 결과 초기화
  };

  useEffect(() => {
    fetchRandomPoster();
  }, [type]);

  return (
    <>
      <NavBar
        onTypeChange={handleTypeChange}
        selectedType={type}
        onSearch={handleSearch}
      />
      <div className="app-wraper" style={{ position: "relative" }}>
        <div className="main-img">
          {randomPoster && (
            <img
              src={`https://image.tmdb.org/t/p/w1280${randomPoster}`}
              alt="랜덤 포스터"
            />
          )}
        </div>
      </div>
      <div className="container">
        {searchResults ? (
          <>
            <div className="carousel-container">
              <h3 className="carousel-title">검색 결과</h3>
              <div className="carousel">
                {searchResults.map((item) => {
                  return (
                    <div key={item.id}>
                      <a
                        href={`https://www.themoviedb.org/${type}/${item.id}`}
                        target="_blank"
                      >
                        {item.poster_path && (
                          <img
                            src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                            alt="포스터"
                          ></img>
                        )}
                      </a>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : (
          // 검색 결과 없을 땐 기존 리스트 보여주기
          <>
            {movieEndpoints.map((endpoint, idx) => (
              <Media
                key={endpoint}
                title={titlesByType[type][idx]}
                type={type}
                endpoint={
                  type === "movie" ? movieEndpoints[idx] : tvEndpoints[idx]
                }
              />
            ))}
          </>
        )}
      </div>
    </>
  );
}

export default App;
