import ReactDOM from "react-dom/client";
import Greeting from "./Greeting.jsx";
import Clock from "./Clock.jsx";
import Counter from "./Counter.jsx";
import Toggle from "./Toggle.jsx";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <Greeting />
    <Clock />
    <Counter />
    <Toggle />
  </>
);
