import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../authContext";

import { Button } from "@primer/react";
import "./auth.css";

import logo from "../../assets/github-mark-white.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setCurrentUser } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Localhost ko badal kar Live Vercel Backend URL add kiya gaya hai
      const res = await axios.post("https://github-clone-auvj.vercel.app/login", {
        email,
        password,
      });

      console.log("========== LOGIN SUCCESS ==========");
      console.log("Full Response:", res.data);

      localStorage.setItem("token", String(res.data.token));
      localStorage.setItem("userId", String(res.data.userId));

      console.log("Stored Token:", localStorage.getItem("token"));
      console.log("Stored UserId:", localStorage.getItem("userId"));

      setCurrentUser(String(res.data.userId));

      setLoading(false);

      window.location.href = "/";
    } catch (err) {
      console.log("========== LOGIN FAILED ==========");

      if (err.response) {
        console.log("Status:", err.response.status);
        console.log("Response:", err.response.data);

        alert(
          typeof err.response.data === "object"
            ? JSON.stringify(err.response.data)
            : err.response.data
        );
      } else {
        console.log(err);
        alert(err.message);
      }

      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <h1>Sign In</h1>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Email address</label>
            <input
              autoComplete="off"
              name="Email"
              id="Email"
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="Password"
              id="Password"
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            New to GitHub? <Link to="/signup">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;