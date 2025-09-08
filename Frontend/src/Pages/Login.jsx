import { useState } from "react";

function Login() {
  const [login, SetLogin] = useState({ userName: "", password: "" });

  return (
    <div>
      <input
        type="text"
        value={login.userName}
        placeholder="username..."
        onChange={(e) => {
          SetLogin({ ...login, userName: e.target.value });
        }}
      />
      <input
        type="password"
        value={login.password}
        placeholder="username..."
        onChange={(e) => {
          SetLogin({ ...login, password: e.target.value });
        }}
      />
      <button>Login</button>
    </div>
  );
}

export default Login;
