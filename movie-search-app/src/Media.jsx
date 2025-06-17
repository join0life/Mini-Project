import { useState, useEffect } from "react";
import { getMediaData } from "./api";

// 베스트순
function Media({
  type = "movie",
  title = "🎬 지금 상영 중",
  endpoint = "now_playing",
}) {
  const MAX_PAGE = 10;

  // 화면 로드될 때 API 데이터 가져오기
  const [lists, setLists] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지

  const handleLoad = async (page) => {
    const { results } = await getMediaData({ type, endpoint, page });
    setLists(results.slice(0, 8));
  };

  // 좌우 스크롤 핸들러
  const handleScrollLeft = () => {
    setPage((prev) => (prev === 1 ? MAX_PAGE : prev - 1));
  };

  const handleScrollRight = () => {
    setPage((prev) => (prev === MAX_PAGE ? 1 : prev + 1));
  };

  useEffect(() => {
    handleLoad(page);
  }, [page, endpoint, type]); // page, endpoint가 바뀌면 다시 fetch

  return (
    <div className="carousel-container">
      <h3 className="carousel-title">{title}</h3>
      <button className="scroll-btn left" onClick={handleScrollLeft}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5 8.25 12l7.5-7.5"
          />
        </svg>
      </button>
      {/* 전체 목록 반복 */}

      <ul className="carousel">
        {lists.map((list) => {
          return (
            <li key={list.id}>
              <a
                href={`https://www.themoviedb.org/${type}/${list.id}`}
                target="_blank"
              >
                {list.poster_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${list.poster_path}`}
                    alt="포스터"
                  ></img>
                )}
              </a>
            </li>
          );
        })}
      </ul>
      <button className="scroll-btn right" onClick={handleScrollRight}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="size-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m8.25 4.5 7.5 7.5-7.5 7.5"
          />
        </svg>
      </button>
    </div>
  );
}

export default Media;
