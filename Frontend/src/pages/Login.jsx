import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import BackgroundMedia from "../components/BackgroundMedia"; // <-- new

// Dev-only role switcher (renders only in dev)
// import DevRoleSwitcher from "../components/DevRoleSwitcher";

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
    <BackgroundMedia
      mp4Src="/media/slide1CCbg.mp4"
      // gifSrc="/media/login-bg.gif"
      posterSrc="/media/login-poster.jpg"
      overlay
    >
      {/* Dev-only helper in the corner */}
      {/* {import.meta.env.DEV && (
        <div style={{ position: "fixed", top: 12, right: 12, zIndex: 20 }}>
          <DevRoleSwitcher />
        </div>
      )} */}

      {/* Foreground auth card */}
      <div className="card slide-in" style={{ maxWidth: 420, width: "100%" }}>
        <div className="card-body">
          <div className="login-brand">
            <img src="/media/logo-subdued.png" alt="Convoy Connect logo" />
            <div>
              <div className="card-title" style={{ margin: 0 }}>
                Convoy Connect
              </div>
            </div>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="label required">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className="input"
                placeholder="joe.m.snuffy.mil@mail.mil"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="label required">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <div className="error">{error}</div>}

            <div
              style={{
                display: "flex",
                gap: ".5rem",
                alignItems: "center",
                marginTop: ".25rem",
              }}
            >
              <button className="btn btn-primary" type="submit">
                Login
              </button>
            </div>
          </form>
          <div className="card-subtitle" style={{ marginTop: 4 }}>
            Secure access
          </div>

          <p className="help" style={{ marginTop: "0.25rem" }}>
            Authorized personnel only. System activity may be monitored.
          </p>
        </div>
      </div>
    </BackgroundMedia>
  );
}

// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { useAuth } from "../context/AuthContext";

// // (dev only)
// import DevRoleSwitcher from "../components/DevRoleSwitcher";

// {
//   import.meta.env.DEV && <DevRoleSwitcher />;
// }

// export default function Login() {
//   const { login } = useAuth();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();
//   const location = useLocation();
//   const from = location.state?.from?.pathname || "/";

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setError("");
//     try {
//       await login(email, password);
//       navigate(from, { replace: true });
//     } catch {
//       setError("Invalid credentials");
//     }
//   };

//   return (
//     <div style={{ maxWidth: 360, margin: "80px auto" }}>
//       <h2>Sign in</h2>
//       <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
//         <input
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//         />
//         <input
//           placeholder="Password"
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//         />
//         {error && <div style={{ color: "red" }}>{error}</div>}
//         <button className="btn-secondary" type="submit">
//           Login
//         </button>
//       </form>
//     </div>
//   );
// }

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
