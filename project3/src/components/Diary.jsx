import { useParams, useNavigate } from "react-router-dom";
import useDiary from "../hooks/useDiary";
import Header from "./Header";
import Button from "./Button";
import { getFormattedDate } from "../util";
import Viewer from "./Viewer";
import { setPageTitle } from "../util";
import { useEffect } from "react";

const Diary = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const data = useDiary(id);

  const goEdit = () => {
    navigate(`../edit/${id}`);
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setPageTitle(`${id}번 일기`);
  }, []);

  if (!data) {
    return <div>일기를 불러오고 있습니다...</div>;
  } else {
    const { date, emotionId, content } = data;
    const title = `${getFormattedDate(new Date(Number(date)))} 기록`;
    return (
      <div>
        <Header
          title={title}
          leftChild={<Button text={"< 뒤로 가기"} onClick={goBack} />}
          rightChild={<Button text={"수정하기"} onClick={goEdit} />}
        />
        <Viewer content={content} emotionId={emotionId} />
      </div>
    );
  }
};

export default Diary;
