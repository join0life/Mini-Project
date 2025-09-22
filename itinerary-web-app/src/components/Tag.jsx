import "./Tag.css";
import React from "react";

const Tag = ({ tags, onTagsChange, maxTagNum = 1 }) => {
  const handleKeyDown = (e) => {
    if (e.key !== "Enter") return;

    // IME 조합 중인 경우 무시 (한글 입력 중복 방지)
    if (e.nativeEvent.isComposing || e.isComposing) return;

    const value = e.target.value.trim();
    if (!value) return;
    if (tags.includes(value)) return; // 중복 태그 방지

    onTagsChange([...tags, value]);
    e.target.value = "";
  };

  const removeTag = (tagIdx) => {
    onTagsChange(tags.filter((tag, idx) => idx !== tagIdx));
  };

  return (
    <div className="tag-input-container">
      {tags.map((tag, idx) => (
        <div key={idx} className="tag-item">
          <span>{tag}</span>
          <span onClick={() => removeTag(idx)} className="tag-remove">
            &times;
          </span>
        </div>
      ))}
      {tags.length < maxTagNum && (
        <input
          className="tag-input"
          onKeyDown={handleKeyDown}
          placeholder={
            tags.length === 0 ? "엔터를 입력하여 태그를 등록해주세요" : ""
          }
        />
      )}
    </div>
  );
};

export default React.memo(Tag);
