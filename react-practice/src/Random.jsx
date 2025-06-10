import { getRandomUser } from "./api";
import { useEffect, useState } from "react";

function Random() {
  // 유저 정보를 저장할 상태 변수
  const [user, setUser] = useState(null);
  // 로딩 처리를 위한 상태 변수
  const [isLoading, setIsLoading] = useState(false);
  // 에러 처리를 위한 상태 변수
  const [loadingError, setLoadingError] = useState(null);

  const handleLoad = async () => {
    setIsLoading(true); // API 호출 전 설정
    setLoadingError(null);

    try {
      const result = await getRandomUser();
      setUser(result);
    } catch (error) {
      setLoadingError(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleLoad();
  }, []);

  if (isLoading) return <p>로딩 중...</p>;
  if (loadingError) return <p>에러 발생: {loadingError.message}</p>;
  if (!user) return null;

  const fullName = `${user.name.first} ${user.name.last}`;

  return (
    <div className="random">
      <h1>랜덤 유저 카드</h1>
      <img src={user.picture.large} alt="유저" />
      <p>{fullName}</p>
      <p>
        {fullName} lives in {user.location.country}!
      </p>
      <button onClick={handleLoad}>다시 불러오기</button>
    </div>
  );
}

export default Random;
