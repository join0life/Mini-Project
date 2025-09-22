import "./App.css";
import React from "react";
import { Routes, Route } from "react-router-dom";
import Itinerary from "./pages/Itinerary";
import Calendar from "./pages/Calendar";
import Modal from "./components/Modal";
import { useReducer, useRef, useState, useEffect } from "react";

export const ItineraryStateContext = React.createContext();
export const ItineraryDispatchContext = React.createContext();

function reducer(state, action) {
  switch (action.type) {
    case "CREATE": {
      const { userName, ...data } = action.data;
      const newUserData = [data, ...(state[userName] || [])];
      newUserData.sort((a, b) => a.id - b.id);
      const newState = { ...state, [userName]: newUserData };
      localStorage.setItem("itineraryData", JSON.stringify(newState));
      return newState;
    }
    case "UPDATE": {
      const { userName, ...data } = action.data;

      // 🔍 디버깅: UPDATE 액션 데이터 확인
      // console.log("🔍 [App.jsx] UPDATE action 받음:", action.data);
      // console.log("🔍 [App.jsx] 현재 userName의 데이터:", state[userName]);

      const updatedUserData = (state[userName] || []).map((it) => {
        if (String(it.id) === String(data.id)) {
          // 🔍 디버깅: 업데이트되는 항목 확인
          // console.log("🔍 [App.jsx] 업데이트 전 항목:", it);
          // console.log("🔍 [App.jsx] 업데이트 후 항목:", { ...data });
          return { ...data };
        }
        return it;
      });

      updatedUserData.sort((a, b) => a.id - b.id);
      const newState = { ...state, [userName]: updatedUserData };
      localStorage.setItem("itineraryData", JSON.stringify(newState));

      // 🔍 디버깅: 최종 업데이트된 배열 확인
      // console.log("🔍 [App.jsx] 최종 updatedUserData:", updatedUserData);

      return newState;
    }
    case "DELETE": {
      const { userName, id } = action.data;
      const newState = {
        ...state,
        [userName]: (state[userName] || []).filter(
          (it) => String(it.id) !== String(id)
        ),
      };
      localStorage.setItem("itineraryData", JSON.stringify(newState));
      return newState;
    }
    case "INIT": {
      return action.data;
    }
    default:
      return state;
  }
}

function App() {
  const [data, dispatch] = useReducer(reducer, {});
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const idRef = useRef(0);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_API_KEY
    }&libraries=services,clusterer,drawing`;
    script.async = true;
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    const rowData = localStorage.getItem("itineraryData");
    if (!rowData) {
      setIsDataLoaded(true);
      return;
    }

    const localData = JSON.parse(rowData);
    if (Object.keys(localData).length === 0) {
      setIsDataLoaded(true);
      return;
    }

    // idRef.current = localData[0].id + 1;
    let maxId = 0;
    Object.values(localData).forEach((userTasks) => {
      if (Array.isArray(userTasks) && userTasks.length > 0) {
        const userMaxId = Math.max(...userTasks.map((task) => task.id || 0));
        maxId = Math.max(maxId, userMaxId);
      }
    });
    idRef.current = maxId + 1;

    dispatch({ type: "INIT", data: localData });
    setIsDataLoaded(true);
  }, []);

  const onCreate = (
    userName,
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
    dispatch({
      type: "CREATE",
      data: {
        userName,
        id: idRef.current,
        text,
        allday,
        start: new Date(),
        startTime,
        end,
        endTime,
        tags,
        location,
        memo,
        isChecked: false,
      },
    });
    idRef.current++;
  };

  const onUpdate = (
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
  ) => {
    // 🔍 디버깅: onUpdate 함수 호출 확인
    // console.log("🔍 [App.jsx] onUpdate 호출됨:", {
    //   userName,
    //   targetId,
    //   text,
    //   allday,
    //   start,
    //   startTime,
    //   end,
    //   endTime,
    //   tags,
    //   location,
    //   memo,
    // });

    dispatch({
      type: "UPDATE",
      data: {
        userName,
        id: targetId,
        text,
        allday,
        start,
        startTime,
        end,
        endTime,
        tags,
        location,
        memo,
        isChecked,
      },
    });
  };

  const onDelete = (userName, targetId) => {
    dispatch({
      type: "DELETE",
      data: {
        userName,
        id: targetId,
      },
    });
  };

  // 체크 상태만 업데이트하는 함수
  const onToggleCheck = (userName, targetId, isChecked) => {
    const userData = data[userName] || [];
    const targetTask = userData.find(
      (it) => String(it.id) === String(targetId)
    );

    if (targetTask) {
      dispatch({
        type: "UPDATE",
        data: {
          ...targetTask,
          userName,
          isChecked,
        },
      });
    }
  };

  const getUserData = (userName) => {
    const userData = data[userName] || [];
    return userData.sort((a, b) => a.id - b.id);
  };

  if (!isDataLoaded) {
    return <div>데이터 로딩중...</div>;
  } else {
    return (
      <ItineraryStateContext.Provider value={{ data, getUserData }}>
        <ItineraryDispatchContext.Provider
          value={{ onCreate, onUpdate, onDelete, onToggleCheck }}
        >
          <Routes>
            <Route path="/" element={<Itinerary />}></Route>
            <Route path="/calendar" element={<Calendar />}></Route>
            <Route path="/edit/:id" element={<Modal />}></Route>
          </Routes>
        </ItineraryDispatchContext.Provider>
      </ItineraryStateContext.Provider>
    );
  }
}

export default App;
