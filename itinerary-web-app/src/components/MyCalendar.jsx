import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./MyCalendar.css"; // 커스텀 CSS
import ViewModal from "./ViewModal"; // 읽기 전용 모달 import
import { useState, useContext } from "react";
import { ItineraryStateContext } from "../App";

// 한국어 설정
moment.locale("ko");

// 커스텀 한국어 설정
moment.updateLocale("ko", {
  months: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  monthsShort: [
    "1월",
    "2월",
    "3월",
    "4월",
    "5월",
    "6월",
    "7월",
    "8월",
    "9월",
    "10월",
    "11월",
    "12월",
  ],
  weekdays: [
    "일요일",
    "월요일",
    "화요일",
    "수요일",
    "목요일",
    "금요일",
    "토요일",
  ],
  weekdaysShort: ["일", "월", "화", "수", "목", "금", "토"],
  weekdaysMin: ["일", "월", "화", "수", "목", "금", "토"],
  meridiem: function (hours, minutes, isLower) {
    if (hours < 12) {
      return isLower ? "오전" : "오전";
    } else {
      return isLower ? "오후" : "오후";
    }
  },
  meridiemParse: /오전|오후/,
  isPM: function (input) {
    return input === "오후";
  },
});

const localizer = momentLocalizer(moment);

const MyCalendar = ({ completedTasks }) => {
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const itinerary = useContext(ItineraryStateContext);

  const events = completedTasks
    .filter((task) => task.isChecked && task.start)
    .map((task) => {
      // console.log("Task being processed:", task); // 디버깅용

      let startDate, endDate;

      if (task.allday) {
        startDate =
          task.start instanceof Date ? task.start : new Date(task.start);
        endDate = task.end
          ? task.end instanceof Date
            ? task.end
            : new Date(task.end)
          : startDate;
      } else {
        // 시간이 지정된 일정인 경우
        const baseDate =
          task.start instanceof Date ? task.start : new Date(task.start);

        if (task.startTime) {
          // startTime이 있는 경우 시간 설정
          const [hours, minutes] = task.startTime.split(":").map(Number);
          startDate = new Date(baseDate);
          startDate.setHours(hours, minutes, 0, 0);
        } else {
          startDate = baseDate;
        }

        if (task.end && task.endTime) {
          // end 날짜와 endTime이 모두 있는 경우
          const endBaseDate =
            task.end instanceof Date ? task.end : new Date(task.end);
          const [endHours, endMinutes] = task.endTime.split(":").map(Number);
          endDate = new Date(endBaseDate);
          endDate.setHours(endHours, endMinutes, 0, 0);
        } else if (task.endTime) {
          // endTime만 있는 경우 (같은 날)
          const [endHours, endMinutes] = task.endTime.split(":").map(Number);
          endDate = new Date(startDate);
          endDate.setHours(endHours, endMinutes, 0, 0);
        } else {
          // 시간 정보가 없으면 1시간 기본 지속시간
          endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
        }
      }

      // 이벤트 제목에 시간, 태그, 위치 정보 추가
      let eventTitle = task.text;

      // 시간 정보 추가
      if (task.startTime) {
        eventTitle = `${eventTitle}`;
      }

      return {
        id: task.id,
        title: eventTitle,
        start: startDate,
        end: endDate,
        allDay: task.allday || false,
        resource: task,
      };
    });

  // console.log("Events for calendar:", events); // 디버깅용

  // 이벤트 클릭 핸들러
  const handleEventClick = (event) => {
    setSelectedTask(event.resource);
    setIsModalOpen(true);
  };

  // 모달 닫기 핸들러
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  // 커스텀 시간 표시 형식
  const formats = {
    timeGutterFormat: (date, culture, localizer) =>
      localizer.format(date, "HH:mm", culture), // 24시간 형식 "14:30"

    eventTimeRangeFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, "HH:mm", culture) +
      " - " +
      localizer.format(end, "HH:mm", culture),

    // 일간/주간 헤더: "9월 17일 (화)"
    dayHeaderFormat: (date, culture, localizer) =>
      localizer.format(date, "M월 D일 (ddd)", culture),

    // 일정 헤더에도 연도 추가
    dayRangeHeaderFormat: ({ start, end }, culture, localizer) =>
      localizer.format(start, "YYYY년 M월 D일", culture) +
      " - " +
      localizer.format(end, "YYYY년 M월 D일", culture),
  };

  // 커스텀 컴포넌트들
  const components = {
    // 주간 뷰에서 요일 헤더 (연도 추가)
    week: {
      header: ({ date, label }) => (
        <span className="korean-weekday">
          {moment(date).format("M/D (ddd)")}
        </span>
      ),
    },
    // 커스텀 툴바 (연도 포함)
    toolbar: ({ label, onNavigate }) => (
      <div className="custom-toolbar">
        <button className="nav-btn" onClick={() => onNavigate("PREV")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5 8.25 12l7.5-7.5"
            />
          </svg>
        </button>
        <span className="toolbar-label">{label}</span>
        <button className="nav-btn" onClick={() => onNavigate("NEXT")}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
            width="24"
            height="24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m8.25 4.5 7.5 7.5-7.5 7.5"
            />
          </svg>
        </button>
      </div>
    ),
  };

  return (
    <div className="korean-calendar-container">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        culture="ko"
        views={["week"]}
        defaultView="week"
        step={60}
        timeslots={1}
        formats={formats}
        components={components}
        onSelectEvent={handleEventClick} // 이벤트 클릭 핸들러 추가
        messages={{
          date: "날짜",
          time: "시간",
          event: "일정",
          allDay: "하루종일",
          week: "주간",
          previous: "이전",
          next: "다음",
          yesterday: "어제",
          tomorrow: "내일",
          today: "오늘",
          noEventsInRange: "해당 기간에 일정이 없습니다.",
          showMore: (total) => `+${total}개 더보기`,
        }}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#dcb5b2",
            borderColor: "#a08b7a",
            color: "white",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer", // 클릭 가능함을 나타내는 커서
          },
        })}
        dayPropGetter={(date) => {
          // 주말 스타일링
          const day = date.getDay();
          if (day === 0) {
            // 일요일
            return {
              style: {
                color: "#d63384",
              },
            };
          }
          if (day === 6) {
            // 토요일
            return {
              style: {
                color: "#d63384",
              },
            };
          }
          return {};
        }}
      />

      {/* 모달 렌더링 */}
      {isModalOpen && selectedTask && (
        <ViewModal
          task={selectedTask}
          onClose={handleCloseModal}
          data={itinerary}
        />
      )}
    </div>
  );
};

export default MyCalendar;
