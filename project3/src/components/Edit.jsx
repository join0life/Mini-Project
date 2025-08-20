import Editor from "./Editor";
import Header from "./Header";
import Button from "./Button";
import useDiary from "../hooks/useDiary";
import { useParams, useNavigate } from "react-router-dom";
import { DiaryDispatchContext } from "./App";
import { useContext, useEffect } from "react";
import { setPageTitle } from "../util";

const Edit = () => {
  const { id } = useParams();
  const data = useDiary(id);

  const navigate = useNavigate();

  const { onDelete, onUpdate } = useContext(DiaryDispatchContext);

  const onClickDelete = () => {
    if (window.confirm("일기를 정말 삭제할까요? 다시 복구되지 않아요!")) {
      onDelete(id);
      navigate("/", { replace: true });
    }
  };

  const onSubmit = (data) => {
    if (window.confirm("일기를 정말 수정할까요?")) {
      const { date, emotionId, content } = data;
      onUpdate(id, date, content, emotionId);
      navigate("/", { replace: true });
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    setPageTitle(`${id}번 일기 수정하기`);
  }, []);

  if (!data) {
    return <div>일기를 불러오고 있습니다...</div>;
  } else {
    return (
      <div>
        <Header
          title={"일기 수정하기"}
          leftChild={<Button text={"< 뒤로 가기"} onClick={goBack} />}
          rightChild={
            <Button
              text={"삭제하기"}
              onClick={onClickDelete}
              type={"negative"}
            />
          }
        />
        <Editor initData={data} onSubmit={onSubmit} />
      </div>
    );
  }
};

export default Edit;
