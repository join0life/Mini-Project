import axios from "axios";

const REALTIME_API = "http://api.weatherapi.com/v1/current.json";
const FORECAST_API = "http://api.weatherapi.com/v1/forecast.json";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

export async function getWeatherData(cityName) {
  try {
    // 오늘 데이터
    const realRes = await axios.get(REALTIME_API, {
      params: {
        key: API_KEY,
        q: cityName,
      },
    });

    if (!realRes.data.location) {
      throw new Error("도시를 찾을 수 없습니다.");
    }

    const resolvedName = realRes.data.location.name;
    const currentWeather = "https:" + realRes.data.current.condition.icon;
    const currentTemp = realRes.data.current.temp_c;

    // 3일간 예보 데이터
    const foreRes = await axios.get(FORECAST_API, {
      params: {
        key: API_KEY,
        q: resolvedName,
        days: 3,
      },
    });

    const forecastDays = foreRes.data.forecast.forecastday;
    const dailyWeather = forecastDays.map(
      (day) => "https:" + day.day.condition.icon
    );
    const dailyTemp = forecastDays.map((day) => day.day.avgtemp_c);

    return {
      city: resolvedName, // resolvedName: q -> resolvedName, 해당 문서 내부에서 쓰는 변수명. city: main단에서 쓰기 위해 지은 변수명.
      currentWeather,
      currentTemp: Math.round(currentTemp),
      dailyWeather,
      dailyTemp: dailyTemp.map((temp) => Math.round(temp)),
    };
  } catch (error) {
    throw error;
  }
}

// - OpenWeather API : API_KEY 오류로 실패
// export async function getWeatherData(cityName) {
//   try {
//     //1. 도시명을 위도(lat), 경도(lon)로 변환
//     const geoRes = await axios.get(GEOCODING_API, {
//       params: {
//         q: cityName, // 도시명. 이 변수를 활용할 거면 정의해야 함.
//         limit: 1,
//         appid: API_KEY,
//       },
//     });

//     if (!geoRes.data || geoRes.data.length === 0) {
//       throw new Error("도시를 찾을 수 없습니다.");
//     }

//     /* const lat = geoRes.data[0].lat;
//       const lon = geoRes.data[0].lon;
//       const resolvedName = geoRes.data[0].name;를 구조 분해 할당해서 해당 파라미터로 One Call API를 요청 */
//     const { lat, lon, name: resolvedName } = geoRes.data[0];

//     // 2. 위도, 경도로 3일치 날씨 예보 가져오기
//     const oneData = await axios.get(ONECALL_API, {
//       params: {
//         lat,
//         lon,
//         units: "metric",
//         appid: API_KEY,
//       },
//     });

//     const currentWeather = oneData.current.weather[0].icon; // today 날씨 아이콘, 배열이라 slice 못 씀
//     const currentTemp = oneData.current.temp; // today 기온, 객체
//     const dailyWeather = oneData.daily
//       .slice(0, 3)
//       .map((day) => day.weather[0].icon); // today ~ 3일치 날씨
//     const dailyTemp = oneData.daily.slice(0, 3).map((day) => day.temp.day); // today ~ 3일치 기온

//     // 3. 필요한 데이터들 묶어서 객체로 반환
//     return {
//       city: resolvedName,
//       currentWeather,
//       currentTemp: Math.round(currentTemp),
//       dailyWeather,
//       dailyTemp: dailyTemp.map((temp) => Math.round(temp)), // 소수점 제거
//     };
//   } catch (error) {
//     throw error; // main.js에서 axiosAPI.js를 호출했으므로 에러를 호출한 쪽에서 처리하도록 던지기
//   }
// }
