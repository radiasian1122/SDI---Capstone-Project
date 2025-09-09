import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch {
      setError("Invalid credentials");
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Sign in</h2>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <div style={{ color: "red" }}>{error}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

// import { useState } from "react";

// function Login() {
//   const [login, SetLogin] = useState({ userName: "", password: "" });

//   return (
//     <div>
//       <input
//         type="text"
//         value={login.userName}
//         placeholder="username..."
//         onChange={(e) => {
//           SetLogin({ ...login, userName: e.target.value });
//         }}
//       />
//       <input
//         type="password"
//         value={login.password}
//         placeholder="username..."
//         onChange={(e) => {
//           SetLogin({ ...login, password: e.target.value });
//         }}
//       />
//       <button>Login</button>
//     </div>
//   );
// }

// export default Login;
