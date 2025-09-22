import LNB from "../components/LNB";
import MyCalendar from "../components/MyCalendar";
import { useContext, useEffect } from "react";
import { ItineraryStateContext } from "../App";
import "./Calendar.css";
import { setPageTitle } from "../components/util.jsx";

function Calendar() {
  const { data } = useContext(ItineraryStateContext);
  const itinerary = Object.values(data).flat(); //  Object.values(data).flat()로 모든 일정을 하나의 배열로 변환
  const completedTasks = itinerary.filter((it) => it.isChecked);

  useEffect(() => {
    setPageTitle("캘린더");
  }, []);

  return (
    <div className="Calendar">
      <LNB />
      <div className="calendar-container">
        <MyCalendar completedTasks={completedTasks} />
      </div>
    </div>
  );
}

export default Calendar;
