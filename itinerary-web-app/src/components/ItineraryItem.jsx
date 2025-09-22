// ItineraryItem.jsx - 모바일 Modal 수정 버전

import { useState, useEffect, useRef, useContext, useCallback } from "react";
import "./ItineraryItem.css";
import useItinerary from "../hooks/useItinerary";
import Modal from "./Modal";
import { formatDate } from "./util";
import { ItineraryDispatchContext } from "../App";

const ItineraryItem = ({
  onSubmit,
  onUpdate,
  isEditing = false,
  initText,
  id,
  userName,
  isChecked: propIsChecked = false,
}) => {
  const [text, setText] = useState(initText || "");
  const [isEditMode, setIsEditMode] = useState(false);
  const [editText, setEditText] = useState(initText || "");
  const inputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(propIsChecked);

  // 모바일 터치 이벤트 추적
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);

  const itinerary = useItinerary(userName, id);
  const { onToggleCheck } = useContext(ItineraryDispatchContext);

  // 터치 디바이스 감지
  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
  }, []);

  useEffect(() => {
    setEditText(initText || "");
  }, [initText]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    setIsChecked(propIsChecked);
  }, [propIsChecked]);

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const handleEditChange = (e) => {
    setEditText(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && text.trim() !== "") {
      onSubmit(text);
      setText("");
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  // 텍스트 클릭 시 수정 모드 진입 (모바일 최적화)
  const handleTextClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isChecked) {
      setIsEditMode(true);
      setEditText(initText);
    }
  };

  // 모바일 터치 이벤트 처리
  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
  };

  const handleTouchEnd = (e) => {
    const touchDuration = Date.now() - touchStartTime;

    // 짧은 터치만 클릭으로 처리 (300ms 이하)
    if (touchDuration < 300) {
      handleTextClick(e);
    }
  };

  const handleSave = () => {
    if (editText.trim() !== "" && onUpdate) {
      onUpdate(
        id,
        editText.trim(),
        itinerary?.allday,
        itinerary?.start,
        itinerary?.startTime,
        itinerary?.end,
        itinerary?.endTime,
        itinerary?.tags,
        itinerary?.location,
        itinerary?.memo,
        isChecked
      );
      setIsEditMode(false);
    } else {
      handleCancel();
    }
  };

  const handleCancel = () => {
    setEditText(initText || "");
    setIsEditMode(false);
  };

  const handleModalUpdate = (
    userName,
    targetId,
    text,
    allday,
    start,
    startTime,
    end,
    endTime,
    tags,
    location,
    memo
  ) => {
    if (onUpdate) {
      onUpdate(
        targetId,
        text,
        allday,
        start,
        startTime,
        end,
        endTime,
        tags,
        location,
        memo,
        isChecked
      );
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
  };

  // 모바일에서 더 안전한 블러 처리
  const handleBlur = (e) => {
    // 모바일에서는 relatedTarget이 자주 null이므로 더 신중하게 처리
    if (isTouchDevice) {
      // 모바일에서는 터치 이벤트로 모달을 열 때 블러를 무시
      return;
    }

    if (
      e.relatedTarget &&
      (e.relatedTarget.classList.contains("modal-btn") ||
        e.relatedTarget.classList.contains("modal-button") ||
        (e.relatedTarget.closest && e.relatedTarget.closest(".Modal")))
    ) {
      return;
    }

    if (editText.trim() === "" && onUpdate) {
      onUpdate({ ...itinerary, text: editText.trim() });
    }

    handleCancel();
  };

  // 모달 버튼 클릭 핸들러 (모바일 최적화)
  const handleModalButtonClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 입력 값 저장 후 모달 열기
    if (editText.trim() !== "" && onUpdate) {
      onUpdate(
        id,
        editText.trim(),
        itinerary?.allday,
        itinerary?.start,
        itinerary?.startTime,
        itinerary?.end,
        itinerary?.endTime,
        itinerary?.tags,
        itinerary?.location,
        itinerary?.memo,
        isChecked
      );
    }

    setIsModalOpen(true);
    document.activeElement.blur(); // input 박스에서 아웃 포커싱
  };

  // 모바일 터치를 위한 모달 버튼 터치 핸들러
  const handleModalButtonTouch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleModalButtonClick(e);
  };

  const handleCheckToggle = (targetId, isChecked) => {
    onToggleCheck(userName, id, isChecked);
    setIsChecked((prev) => isChecked);
  };

  // 새로운 항목 추가 모드
  if (isEditing === true || !initText) {
    return (
      <div className="ItineraryItem editing">
        <input
          type="text"
          onChange={handleChange}
          value={text}
          onKeyDown={handleKeyDown}
          placeholder="일정 입력..."
          autoFocus
          onBlur={(e) => {
            if (text.trim() !== "") {
              onSubmit(text);
              setText("");
            }
          }}
        />
      </div>
    );
  }

  // 기존 항목 표시/수정 모드
  return (
    <div className="ItineraryItem">
      <div className="checkbox-wrapper">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={(e) => handleCheckToggle(id, e.target.checked)}
        />
      </div>
      {isEditMode ? (
        // 수정 모드
        <div className="edit-mode">
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={handleEditChange}
            onKeyDown={handleEditKeyDown}
            className="edit-input"
            onBlur={isTouchDevice ? undefined : handleBlur} // 모바일에서는 블러 이벤트 제거
          />
          <button
            onClick={handleModalButtonClick}
            onTouchEnd={isTouchDevice ? handleModalButtonTouch : undefined}
            className="modal-btn modal-button"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z"
              />
            </svg>
          </button>
          {isModalOpen && (
            <Modal
              key={`modal-${id}-${Date.now()}`}
              id={id}
              data={itinerary}
              onClose={handleModalClose}
              onUpdate={handleModalUpdate}
              userName={userName}
              initText={editText}
              isEditMode={setIsEditMode}
              isOpen={isModalOpen}
            />
          )}
        </div>
      ) : (
        // 일반 모드
        <div
          className={`item-text-tags-date-wrapper ${
            isChecked ? "checked" : ""
          }`}
        >
          <div
            className="item-text clickable"
            onClick={isTouchDevice ? undefined : handleTextClick}
            onTouchStart={isTouchDevice ? handleTouchStart : undefined}
            onTouchEnd={isTouchDevice ? handleTouchEnd : undefined}
          >
            {initText}
          </div>
          {(itinerary?.tags || itinerary?.start) && (
            <div className="sub-contents">
              <div className="sub-tags">
                <span>{itinerary.tags || ""}</span>
              </div>
              <div className="sub-date">
                {itinerary.start && formatDate(new Date(itinerary.start))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItineraryItem;
