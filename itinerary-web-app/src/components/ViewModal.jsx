import Button from "./Button";
import { useContext, useEffect, useRef, useState } from "react";
import "./Modal.css";
import { ItineraryDispatchContext } from "../App";

const ViewModal = ({ task, onClose, data }) => {
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const { onDelete } = useContext(ItineraryDispatchContext);

  // 카카오맵 초기화 (읽기 전용)
  useEffect(() => {
    if (task && mapRef.current && window.kakao && window.kakao.maps) {
      // 지도 생성
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심좌표
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      kakaoMapRef.current = map;

      // 위치 정보가 있는 경우 마커 표시
      if (task.location) {
        // 위도, 경도 형식인지 확인
        const coordMatch = task.location.match(
          /위도:\s*([\d.]+),\s*경도:\s*([\d.]+)/
        );

        if (coordMatch) {
          // 좌표 형식인 경우
          const lat = parseFloat(coordMatch[1]);
          const lng = parseFloat(coordMatch[2]);

          const position = new window.kakao.maps.LatLng(lat, lng);
          const marker = new window.kakao.maps.Marker({
            position: position,
          });

          marker.setMap(map);
          map.setCenter(position);
          currentMarkerRef.current = marker;
        } else {
          // 주소 형식인 경우 - 주소를 좌표로 변환
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(task.location, function (result, status) {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = new window.kakao.maps.LatLng(
                result[0].y,
                result[0].x
              );
              const marker = new window.kakao.maps.Marker({
                position: coords,
              });

              marker.setMap(map);
              map.setCenter(coords);
              currentMarkerRef.current = marker;
            }
          });
        }
      }
    }
  }, [task]);

  // 삭제 버튼 핸들러
  const onClickDelete = () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      // data에서 해당 task를 찾아서 삭제
      if (data && data.data) {
        // data.data에서 모든 사용자의 데이터를 순회하며 해당 task 찾기
        Object.keys(data.data).forEach((userName) => {
          const userTasks = data.data[userName];
          const taskIndex = userTasks.findIndex((t) => t.id === task.id);
          if (taskIndex !== -1) {
            onDelete(userName, task.id);
          }
        });
      }
      onClose();
    }
  };

  // 시간 포맷팅 함수
  const formatTime = (startTime, endTime) => {
    if (!startTime && !endTime) return "시간 미지정";
    if (startTime && endTime) return `${startTime} - ${endTime}`;
    if (startTime) return `${startTime}부터`;
    return "시간 미지정";
  };

  // 날짜 포맷팅 함수
  const formatDate = (start, end) => {
    if (!start) return "날짜 미지정";
    const startDate = new Date(start).toLocaleDateString("ko-KR");
    if (end && end !== start) {
      const endDate = new Date(end).toLocaleDateString("ko-KR");
      return `${startDate} - ${endDate}`;
    }
    return startDate;
  };

  // 위치 표시 함수
  const formatLocation = (location) => {
    if (!location) return "위치 미지정";

    // 좌표 형식인지 확인
    const coordMatch = location.match(/위도:\s*([\d.]+),\s*경도:\s*([\d.]+)/);
    if (coordMatch) {
      return `좌표: ${coordMatch[1]}, ${coordMatch[2]}`;
    }
    console.log(location);

    return location;
  };

  if (!task) return null;

  return (
    <div className="Modal">
      <div className="modal-body">
        <div className="btn-wrapper">
          <Button type="default" text={"닫기"} onClick={onClose} />
          <Button type="edit" text={"삭제"} onClick={onClickDelete} />
        </div>

        <div className="content-wrapper">
          {/* 제목 */}
          <div className="view-section">
            <h2 className="task-title">{task.text}</h2>
          </div>

          {/* 하루종일 여부 */}
          <div className="allday-wrapper">
            <span>하루종일</span>
            <div
              className={`switch-allday ${task.allday ? "active" : "inactive"}`}
            ></div>
          </div>

          {/* 날짜 */}
          {/* <div className="view-section">
                <span>날짜</span>
                <span className="value">{formatDate(task.start, task.end)}</span>
              </div> */}
          <div className="start-wrapper">
            <span>시작</span>
            <div>{formatDate(task.start)}</div>
            {!task.allday && <div>{task.startTime}</div>}
          </div>
          <div className="end-wrapper">
            <span>종료</span>
            {task.end ? (
              <div>{formatDate(task.end)}</div>
            ) : (
              <div>{formatDate(task.start)}</div>
            )}
            {!task.allday && <div>{task.endTime}</div>}
          </div>
          {/* 시간 (하루종일이 아닌 경우에만) */}
          {/* {!task.allday && (
                <div className="view-section">
                  <span className="label">시간</span>
                  <span className="value">
                    {formatTime(task.startTime, task.endTime)}
                  </span>
                </div>
              )} */}

          {/* 태그 */}
          {task.tags && task.tags.length > 0 && (
            <div className="tag-wrapper">
              <span>태그</span>
              <div className="tags-display">
                {task.tags.map((tag, index) => (
                  <span key={index} className="tag-item">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 위치 */}
          {task.location && (
            <div className="location-wrapper">
              <span>위치</span>
              <div style={{ fontSize: "0.9rem" }}>
                {formatLocation(task.location)}
              </div>

              {/* 지도 */}
              <div className="map-container" style={{ marginTop: "10px" }}>
                <div
                  ref={mapRef}
                  id="map"
                  style={{
                    width: "100%",
                    height: "200px",
                    border: "1px solid #ddd",
                    borderRadius: "4px",
                  }}
                ></div>
              </div>
            </div>
          )}

          {/* 메모 */}
          {task.memo && (
            <div className="memo-wrapper">
              <span>메모</span>
              <div style={{ fontSize: "0.9rem" }}>{task.memo}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
