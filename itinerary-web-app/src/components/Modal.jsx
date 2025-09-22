import Button from "./Button";
import Tag from "./Tag";
import { useState, useContext, useEffect, useCallback } from "react";
import "./Modal.css";
import { ItineraryDispatchContext } from "../App";
import useKakaoMap from "../hooks/useKakaoMap";
import { formatDateForInput } from "./util";

const Modal = ({
  id,
  data,
  onClose,
  onUpdate,
  userName,
  initText,
  isEditMode,
  isOpen,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");

  // 커스텀 훅 사용
  const {
    mapRef,
    searchResults,
    setSearchResults,
    searchPlaces,
    selectPlace,
    setMapClickEvent,
  } = useKakaoMap(isOpen);

  // 초기 상태를 함수로 설정하여 매번 새로 계산
  const [state, setState] = useState(() => ({
    text: data?.text || initText || "",
    allday: data?.allday ?? true,
    start: data?.start || "",
    startTime: data?.startTime || "",
    end: data?.end || "",
    endTime: data?.endTime || "",
    tags: data?.tags || [],
    location: data?.location || "",
    memo: data?.memo || "",
  }));

  const { onDelete } = useContext(ItineraryDispatchContext);

  // Modal이 열릴 때마다 데이터로 상태 초기화
  useEffect(() => {
    if (isOpen && data) {
      const newState = {
        text: data.text || initText || "",
        allday: data.allday ?? true,
        start: data.start || "",
        startTime: data.startTime || "",
        end: data.end || "",
        endTime: data.endTime || "",
        tags: data.tags || [],
        location: data.location || "",
        memo: data.memo || "",
      };
      setState(newState);
    }
  }, [isOpen, data, initText]);

  // 지도 클릭 이벤트 설정
  useEffect(() => {
    if (isOpen) {
      setMapClickEvent((location) => {
        handleChange("location", location);
      });
    }
  }, [isOpen]);

  // 장소 검색 함수 (커스텀 훅 사용)
  const handleSearchPlaces = () => {
    searchPlaces(searchKeyword);
  };

  // 장소 선택 함수 (커스텀 훅 사용)
  const handleSelectPlace = (place) => {
    selectPlace(place, (location) => {
      handleChange("location", location);
    });
  };

  // 상태 객체를 부분적으로 업데이트하기 위한 함수
  const handleChange = (field, value) => {
    setState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // 태그 변경 함수
  const handletagsChange = useCallback((newtags) => {
    handleChange("tags", newtags);
  }, []);

  // 하루종일 토글 함수
  const toggleAllday = () => {
    const newAllday = !state.allday;
    setState((prev) => ({
      ...prev,
      allday: newAllday,
      end: newAllday ? "" : prev.end,
      startTime: newAllday ? "" : prev.startTime,
      endTime: newAllday ? "" : prev.endTime,
    }));
  };

  const handleSave = () => {
    if (state.text.trim() === "") {
      alert("내용을 입력하세요.");
      return;
    } else {
      const {
        text,
        allday,
        start,
        startTime,
        end,
        endTime,
        tags,
        location,
        memo,
      } = state;

      onUpdate(
        userName,
        id,
        text,
        allday,
        start,
        startTime,
        end || start,
        endTime,
        tags,
        location,
        memo
      );

      isEditMode(false);
      onClose();
    }
  };

  const onClickDelete = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      onDelete(userName, id);
      isEditMode(false);
      onClose();
    }
  };

  return (
    <div className="Modal">
      <div className="modal-body">
        <div className="btn-wrapper">
          <Button type="edit" text={"취소"} onClick={onClose} />
          <Button type="default" text={"완료"} onClick={handleSave} />
        </div>
        <div className="content-wrapper">
          <input
            type="text"
            value={state.text}
            onChange={(e) => handleChange("text", e.target.value)}
            placeholder="제목을 입력하세요"
            className="title-input"
          />
          <div className="allday-wrapper">
            <span>하루종일</span>
            <div
              className={`switch-allday ${
                state.allday ? "active" : "inactive"
              }`}
              onClick={toggleAllday}
            ></div>
          </div>
          <div className="start-wrapper">
            <span>시작</span>
            <input
              type="date"
              value={formatDateForInput(state.start)}
              onChange={(e) => handleChange("start", e.target.value)}
            />
            {!state.allday && (
              <input
                type="time"
                value={state.startTime || ""}
                onChange={(e) => handleChange("startTime", e.target.value)}
              />
            )}
          </div>
          <div className="end-wrapper">
            <span>종료</span>
            <input
              type="date"
              value={state.end || ""}
              onChange={(e) => handleChange("end", e.target.value)}
            />
            {!state.allday && (
              <input
                type="time"
                value={state.endTime || ""}
                onChange={(e) => handleChange("endTime", e.target.value)}
              />
            )}
          </div>
          <div className="tag-wrapper">
            <span>태그</span>
            <Tag
              tags={state.tags}
              onTagsChange={handletagsChange}
              maxTagNum={1}
            />
          </div>
          <div className="location-wrapper">
            <span>위치</span>
            <div className="location-container">
              <div className="search-container">
                <input
                  type="text"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                  placeholder="장소를 검색하세요"
                  onKeyPress={(e) => e.key === "Enter" && handleSearchPlaces()}
                />
                <button type="button" onClick={handleSearchPlaces}>
                  검색
                </button>
              </div>
              <div>
                {state.location && (
                  <input
                    value={state.location}
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      outline: "none",
                      width: "100%",
                      color: "#333",
                    }}
                    disabled
                  ></input>
                )}
              </div>
              {searchResults.length > 0 && (
                <div
                  className="search-results"
                  style={{
                    maxHeight: "150px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                    marginTop: "8px",
                  }}
                >
                  {searchResults.map((place, index) => (
                    <div
                      key={index}
                      onClick={() => handleSelectPlace(place)}
                      style={{
                        padding: "8px",
                        cursor: "pointer",
                        borderBottom: "1px solid #eee",
                        ":hover": { backgroundColor: "#f5f5f5" },
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#f5f5f5")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "white")
                      }
                    >
                      <div style={{ fontWeight: "bold" }}>
                        {place.place_name}
                      </div>
                      <div style={{ fontSize: "12px", color: "#666" }}>
                        {place.road_address_name || place.address_name}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div
                ref={mapRef}
                id="map"
                style={{
                  width: "100%",
                  height: "300px",
                  marginTop: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              ></div>
            </div>
          </div>
          <div className="memo-wrapper">
            <span>메모</span>
            <textarea
              value={state.memo}
              onChange={(e) => handleChange("memo", e.target.value)}
              placeholder="메모를 입력하세요"
            />
          </div>
          <div className="delete-btn-wrapper">
            <Button type="edit" text={"이벤트 삭제"} onClick={onClickDelete} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
