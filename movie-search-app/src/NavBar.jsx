import { useState, useEffect } from "react";
import "./NavBar.css";

function NavBar({ onSearch, onTypeChange, selectedType }) {
  const [searchInput, setSearchInput] = useState("");
  const [isScrolled, setIsScrolled] = useState(false); // 스크롤 값

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchInput); // 부모 컴포넌트에 검색어 전달
    setSearchInput("");
  };

  // 검색 함수
  const handleInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  // addEventListener와 removeEventListener는 useEffect 안에 넣어야 함
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? "scrolled" : ""}`}>
      <div className="logo">
        <a href="./index.html">MovieApp</a>
      </div>
      <ul className="menu-bar">
        <li>
          <button
            className={`btn menu-bar ${
              selectedType === "movie" ? "active" : ""
            }`}
            onClick={() => onTypeChange("movie")}
          >
            영화
          </button>
        </li>

        <li>
          <button
            className={`btn menu-bar ${selectedType === "tv" ? "active" : ""}`}
            onClick={() => onTypeChange("tv")}
          >
            시리즈
          </button>
        </li>
      </ul>
      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="검색..."
          value={searchInput}
          onChange={handleInputChange}
        />
        <button className="btn search" type="submit">
          🔍
        </button>
      </form>
    </nav>
  );
}

export default NavBar;
