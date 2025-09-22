import { useRef, useEffect, useState } from "react";

const useKakaoMap = (isOpen = true) => {
  const mapRef = useRef(null);
  const kakaoMapRef = useRef(null);
  const currentMarkerRef = useRef(null);
  const placesServiceRef = useRef(null);
  const [searchResults, setSearchResults] = useState([]);
  const [locationName, setLocationName] = useState("");

  // 카카오맵 초기화
  useEffect(() => {
    if (isOpen && mapRef.current && window.kakao && window.kakao.maps) {
      const container = mapRef.current;
      const options = {
        center: new window.kakao.maps.LatLng(37.5665, 126.978), // 서울 중심좌표
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      kakaoMapRef.current = map;

      // 장소 검색 서비스 초기화
      const places = new window.kakao.maps.services.Places();
      placesServiceRef.current = places;
    }
  }, [isOpen]);

  // 좌표를 주소로 변환
  const coordsToAddress = (lat, lng, callback) => {
    if (window.kakao && window.kakao.maps) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.coord2Address(lng, lat, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const detailAddr = result[0].road_address
            ? result[0].road_address.address_name
            : result[0].address.address_name;
          callback(detailAddr);
        } else {
          callback("주소를 찾을 수 없습니다");
        }
      });
    }
  };

  // 주소를 좌표로 변환하고 지도에 표시
  const addressToCoords = (address, callback) => {
    if (window.kakao && window.kakao.maps && kakaoMapRef.current) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, function (result, status) {
        if (status === window.kakao.maps.services.Status.OK) {
          const coords = new window.kakao.maps.LatLng(result[0].y, result[0].x);
          callback(coords, true);
        } else {
          callback(null, false);
        }
      });
    }
  };

  // 마커 생성 및 지도에 추가
  const createMarker = (position) => {
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
    }

    const marker = new window.kakao.maps.Marker({
      position: position,
    });

    marker.setMap(kakaoMapRef.current);
    kakaoMapRef.current.setCenter(position);
    currentMarkerRef.current = marker;

    return marker;
  };

  // 위치 정보로 지도 설정 (좌표 또는 주소)
  const setLocationOnMap = (location, onLocationNameUpdate) => {
    if (!location || !kakaoMapRef.current) return;

    // 좌표 형식인지 확인
    const coordMatch = location.match(/위도:\s*([\d.]+),\s*경도:\s*([\d.]+)/);

    if (coordMatch) {
      // 좌표 형식인 경우
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      const position = new window.kakao.maps.LatLng(lat, lng);

      createMarker(position);

      // 좌표를 주소로 변환
      coordsToAddress(lat, lng, (address) => {
        setLocationName(address);
        if (onLocationNameUpdate) {
          onLocationNameUpdate(address);
        }
      });
    } else {
      // 주소 형식인 경우
      setLocationName(location);
      if (onLocationNameUpdate) {
        onLocationNameUpdate(location);
      }

      addressToCoords(location, (coords, success) => {
        if (success) {
          createMarker(coords);
        }
      });
    }
  };

  // 장소 검색
  const searchPlaces = (keyword) => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return false;
    }

    if (placesServiceRef.current) {
      placesServiceRef.current.keywordSearch(keyword, (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data.slice(0, 5)); // 상위 5개 결과만 표시
          displayPlaces(data);
        } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
          alert("검색 결과가 존재하지 않습니다.");
        } else if (status === window.kakao.maps.services.Status.ERROR) {
          alert("검색 결과 중 오류가 발생했습니다.");
        }
      });
    }
  };

  // 검색 결과를 지도에 표시
  const displayPlaces = (places) => {
    const bounds = new window.kakao.maps.LatLngBounds();

    // 기존 마커 제거
    if (currentMarkerRef.current) {
      currentMarkerRef.current.setMap(null);
    }

    for (let i = 0; i < places.length; i++) {
      const placePosition = new window.kakao.maps.LatLng(
        places[i].y,
        places[i].x
      );

      // 마커 이미지 설정 (번호 표시)
      const imageSrc =
        "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
      const imageSize = new window.kakao.maps.Size(36, 37);
      const imgOptions = {
        spriteSize: new window.kakao.maps.Size(36, 691),
        spriteOrigin: new window.kakao.maps.Point(0, i * 46 + 10),
        offset: new window.kakao.maps.Point(13, 37),
      };

      const markerImage = new window.kakao.maps.MarkerImage(
        imageSrc,
        imageSize,
        imgOptions
      );
      const marker = new window.kakao.maps.Marker({
        position: placePosition,
        image: markerImage,
      });

      marker.setMap(kakaoMapRef.current);
      bounds.extend(placePosition);

      // 마커 클릭 이벤트
      (function (marker, place) {
        window.kakao.maps.event.addListener(marker, "click", function () {
          selectPlace(place);
        });
      })(marker, places[i]);
    }

    kakaoMapRef.current.setBounds(bounds);
  };

  // 장소 선택
  const selectPlace = (place, onLocationChange) => {
    setLocationName(place.place_name);

    if (onLocationChange) {
      onLocationChange(place.place_name);
    }

    // 선택된 장소로 지도 이동 및 마커 표시
    const moveLatLng = new window.kakao.maps.LatLng(place.y, place.x);
    createMarker(moveLatLng);

    setSearchResults([]);
  };

  // 지도 클릭 이벤트 설정 (주소 변환)
  const setMapClickEvent = (onLocationChange) => {
    if (kakaoMapRef.current) {
      window.kakao.maps.event.addListener(
        kakaoMapRef.current,
        "click",
        function (mouseEvent) {
          const latlng = mouseEvent.latLng;
          createMarker(latlng);

          // 좌표를 주소로 변환
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.coord2Address(
            latlng.getLng(),
            latlng.getLat(),
            function (result, status) {
              if (status === window.kakao.maps.services.Status.OK) {
                const detailAddr = result[0].road_address
                  ? result[0].road_address.address_name
                  : result[0].address.address_name;

                setLocationName(detailAddr);
                if (onLocationChange) {
                  onLocationChange(detailAddr);
                }
              }
            }
          );
        }
      );
    }
  };

  return {
    mapRef,
    kakaoMapRef,
    searchResults,
    locationName,
    setLocationName,
    setLocationOnMap,
    searchPlaces,
    selectPlace,
    setMapClickEvent,
    setSearchResults,
  };
};

export default useKakaoMap;
