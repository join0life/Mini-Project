// // import { ItineraryStateContext } from "../App";
// // import { useContext, useState, useEffect } from "react";

// // const useItinerary = (userName, id) => {
// //   const { getUserData } = useContext(ItineraryStateContext);
// //   const [Itinerary, setItinerary] = useState();

// //   useEffect(() => {
// //     if (!userName || id === undefined) return;

// //     const userData = getUserData(userName);
// //     const match = userData.find((it) => String(it.id) === String(id));

// //     if (match) {
// //       setItinerary(match);
// //     }
// //   }, [userName, id, getUserData]);

// //   return Itinerary;
// // };

// // export default useItinerary;

// import { useContext, useMemo } from "react";
// import { ItineraryStateContext } from "../App";

// const useItinerary = (userName, id) => {
//   const { data } = useContext(ItineraryStateContext);

//   // userName이 없으면 모든 사용자 데이터에서 검색
//   const itinerary = useMemo(() => {
//     if (!id) return null;

//     if (userName) {
//       const userData = data[userName] || [];
//       return userData.find((item) => String(item.id) === String(id)) || null;
//     }

//     // userName이 없으면 모든 사용자 데이터에서 검색
//     for (const userKey of Object.keys(data)) {
//       const userData = data[userKey] || [];
//       const found = userData.find((item) => String(item.id) === String(id));
//       if (found) return found;
//     }

//     return null;
//   }, [data, userName, id]);

//   return itinerary;
// };

// export default useItinerary;

import { useContext, useMemo } from "react";
import { ItineraryStateContext } from "../App";

const useItinerary = (userName, id) => {
  const { data } = useContext(ItineraryStateContext);

  // 🔍 디버깅: 현재 context의 전체 데이터 확인
  // console.log("🔍 [useItinerary] 전체 data:", data);
  // console.log("🔍 [useItinerary] 찾는 userName:", userName, "id:", id);

  // userName이 없으면 모든 사용자 데이터에서 검색
  const itinerary = useMemo(() => {
    if (id === undefined || id === null) {
      // console.log("🔍 [useItinerary] id가 없음");
      return null;
    }

    if (userName && data[userName]) {
      const userData = data[userName];
      // console.log("🔍 [useItinerary] userData:", userData);

      const found = userData.find((item) => String(item.id) === String(id));
      // console.log("🔍 [useItinerary] 찾은 데이터:", found);

      return found || null;
    }

    // userName이 없으면 모든 사용자 데이터에서 검색
    for (const userKey of Object.keys(data)) {
      const userData = data[userKey] || [];
      const found = userData.find((item) => String(item.id) === String(id));
      if (found) {
        // console.log("🔍 [useItinerary] 다른 사용자에서 찾은 데이터:", found);
        return found;
      }
    }

    // console.log("🔍 [useItinerary] 데이터를 찾지 못함");
    return null;
  }, [data, userName, id]);

  return itinerary;
};

export default useItinerary;
