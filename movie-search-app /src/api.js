const baseURL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_API_KEY;

export async function getMediaData({
  type = "movie",
  endpoint = "now_playing",
  page = 1,
}) {
  const res = await fetch(
    `${baseURL}/${type}/${endpoint}?language=ko-KR&page=${page}&api_key=${API_KEY}`
  );
  if (!res.ok) {
    throw new Error("리퀘스트 실패");
  }
  const data = await res.json();
  return data;
}

export async function getSearchData({ query, type = "movie" }) {
  const res = await fetch(
    `${baseURL}/search/${type}?api_key=${API_KEY}&language=ko-KR&query=${encodeURIComponent(
      query
    )}`
  );
  if (!res.ok) {
    throw new Error("검색 요청 실패");
  }
  const data = await res.json();
  return data;
}
