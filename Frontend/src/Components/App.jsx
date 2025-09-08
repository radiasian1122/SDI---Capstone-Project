import { useState } from "react";
import "../Styles/App.css";
import Login from "./Login.jsx";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Login />
    </>
  );
}

export default App;
