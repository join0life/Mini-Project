import ItineraryItem from "./ItineraryItem";
import "./ItineraryList.css";
import { useState, useContext } from "react";
import { ItineraryStateContext, ItineraryDispatchContext } from "../App";
import React from "react";

const ItineraryList = ({ userName }) => {
  const [isAdding, setIsAdding] = useState(false);

  const { getUserData } = useContext(ItineraryStateContext);
  const { onCreate, onUpdate } = useContext(ItineraryDispatchContext); // onUpdate 추가

  const userItineraryData = getUserData(userName);
  // useEffect(() => {
  //   console.log("userItineraryData props 변경:", userName, userItineraryData);
  // }, [userItineraryData]);

  const handleButtonClick = () => {
    setIsAdding(true);
  };

  const handleSubmit = (text) => {
    onCreate(userName, text, true, null, null, null, null, "", "", "");
    setIsAdding(false);
  };

  // App.jsx onUpdate 함수 형태: (userName, targetId, text, allday, start, end, tag, location, memo)
  const handleUpdate = (
    targetId,
    text,
    allday = true,
    start = null,
    startTime = null,
    end = null,
    endTime = null,
    tags = [],
    location = "",
    memo = "",
    isChecked = false
  ) => {
    onUpdate(
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
      memo,
      isChecked
    );
  };

  return (
    <div className="ItineraryList">
      <div className="userName">{userName}</div>
      {userItineraryData.map((it) => {
        return (
          <ItineraryItem
            key={it.id}
            id={it.id}
            initText={it.text}
            isEditing={false}
            userName={userName}
            onUpdate={handleUpdate} // onUpdate 전달
            isChecked={it.isChecked}
          />
        );
      })}
      <div className="content-wrapper">
        <button className="addItem" onClick={handleButtonClick}>
          +
        </button>
        {isAdding && <ItineraryItem onSubmit={handleSubmit} isEditing={true} />}
      </div>
    </div>
  );
};

export default ItineraryList;
