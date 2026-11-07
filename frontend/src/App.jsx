
import { useState } from "react";
import API from "./services/api";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );

  const [isRegister, setIsRegister] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: "",
    phone: ""
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // Handle login and registration
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      if (isRegister) {
        await API.post("/auth/register", form);

        setMessage("Registration successful! Please log in.");

        setForm({
          name: "",
          email: form.email,
          password: "",
          department: "",
          phone: ""
        });

        setIsRegister(false);

      } else {
        const response = await API.post("/auth/login", {
          email: form.email,
          password: form.password
        });

        localStorage.setItem("token", response.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );

        setLoggedIn(true);
      }

    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show dashboard after login
  if (loggedIn) {
    return <Dashboard />;
  }

  // Login and registration page
  return (
    <div className="login-container">

      <div className="login-left">

        <div className="brand">
          <span className="brand-icon">F</span>
          <h2>FixMyCampus</h2>
        </div>

        <div className="welcome-content">

          <span className="tagline">
            YOUR CAMPUS, YOUR VOICE
          </span>

          <h1>Making Your Campus a Better Place.</h1>

          <p>
            Report campus issues, track complaints and help
            create a better learning environment.
          </p>

          <div className="feature">
            ✓ Easy complaint reporting
          </div>

          <div className="feature">
            ✓ Real-time status tracking
          </div>

          <div className="feature">
            ✓ Better campus experience
          </div>

        </div>

        <p className="copyright">
          © 2026 FixMyCampus. All rights reserved.
        </p>

      </div>

      <div className="login-right">

        <form
          className="login-form"
          onSubmit={handleSubmit}
        >

          <span className="form-tag">
            STUDENT PORTAL
          </span>

          <h1>
            {isRegister ? "Create Account" : "Welcome Back!"}
          </h1>

          <p className="form-description">
            {isRegister
              ? "Register to start improving your campus."
              : "Sign in to continue to your account."}
          </p>

          {isRegister && (
            <>
              <label>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                required
              />

              <label>Department</label>

              <input
                type="text"
                name="department"
                placeholder="Example: CSE"
                value={form.department}
                onChange={handleChange}
              />

              <label>Phone Number</label>

              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={form.phone}
                onChange={handleChange}
              />
            </>
          )}

          <label>Email Address</label>

          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>

          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={form.password}
            onChange={handleChange}
            minLength={6}
            required
          />

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isRegister
                ? "Create Account →"
                : "Sign In →"}
          </button>

          {message && (
            <p className="message">
              {message}
            </p>
          )}

          <p className="register-text">

            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}

            <span
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
              style={{ cursor: "pointer" }}
            >
              {isRegister ? "Sign In" : "Register Now"}
            </span>

          </p>

        </form>

      </div>

    </div>
  );
}

export default App;
