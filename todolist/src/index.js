const inputText = document.querySelector(".inputText");
const btn = document.querySelector(".inputBtn");
const todoList = document.querySelector(".todoList");

// 할 일 추가하는 함수
function addTodo() {
  // inputText.value가 빈 문자열인 경우
  if (inputText.value.trim() === "") return;

  // input 값을 addTodoList() 함수로 넘기기
  addTodoList(inputText.value);

  inputText.value = "";
}

// 버튼 클릭했을 때 할 일 추가
btn.addEventListener("click", addTodo);

// 엔터키 눌렀을 때 할 일 추가
inputText.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    /* 한글 치고 엔터 누르면 맨 마지막 글자가 한 번 더 입력되는 문제 ->
    / IME 조합 중이거나 keyCode가 229면 무시*/
    if (e.isComposing || e.keyCode === 229) return;
    addTodo();
  }
});

// 삭제 이벤트 위임
todoList.addEventListener("click", (e) => {
  // 삭제 버튼 누를 경우
  if (e.target.classList.contains("deleteBtn")) {
    e.target.parentElement.remove();
  }

  // 체크 버튼 누를 경우
  if (e.target.classList.contains("checkBtn")) {
    e.target.classList.toggle("checked");
    e.target.parentElement.classList.toggle("completed");
  }
});

// 로컬스토리지에 저장해서 새로고침해도 목록 유지하게 하기 위해 배열에 저장
let todos = []; // 모든 할 일을 배열에 저장

function addTodoList(value) {
  const todo = {
    id: Date.now(),
    text: value,
  };

  todos.push(todo);
  saveTodos(); // 로컬스토리지 저장 함수

  paintTodo(todo); // 화면에 표시
}

// 로컬스토리지 저장 함수
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// 페이지 로드시 저장된 데이터 꺼내서 다시 화면에 뿌리기
function loadTodos() {
  const saved = localStorage.getItem("todos");

  if (saved !== null) {
    todos = JSON.parse(saved);
    todos.forEach(paintTodo);
  }
}

// 할 일 삭제 시 배열에서 제거 후 저장
function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveTodos();
}

// 화면에 할 일 불러오기
function paintTodo(todo) {
  const li = document.createElement("li");

  li.innerHTML = `<input type="checkbox" class="checkBtn" />
${todo.text}
<button class="deleteBtn">삭제</button>`;

  // 삭제 버튼 누를 때 로컬스토리지에서도 삭제되게 설정
  li.querySelector(".deleteBtn").addEventListener("click", () => {
    deleteTodo(todo.id); // 배열에서 삭제 + 저장
    li.remove(); // 화면에서 삭제
  });

  todoList.appendChild(li);
}

// 페이지 로드 시 로컬스토리지 내용 불러오기
window.addEventListener("DOMContentLoaded", loadTodos);
