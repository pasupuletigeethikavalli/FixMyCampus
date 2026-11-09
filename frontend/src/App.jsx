
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

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

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

  if (loggedIn) {
    return <Dashboard />;
  }

  return (
    <div className="auth-page">

      {/* LEFT CAMPUS BRANDING PANEL */}
      <section className="auth-left">

        <div className="auth-brand">
          <div className="auth-logo">F</div>

          <div>
            <h2>FixMyCampus</h2>
            <span>Campus Solutions</span>
          </div>
        </div>

        <div className="auth-hero">

          <span className="auth-eyebrow">
            YOUR CAMPUS, YOUR VOICE
          </span>

          <h1>
            Making Your Campus
            <br />
            a Better Place.
          </h1>

          <p>
            Report campus issues, track complaints and help
            create a better learning environment for everyone.
          </p>

          <div className="auth-features">

            <div className="auth-feature">
              <span>✓</span>
              Easy complaint reporting
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Real-time status tracking
            </div>

            <div className="auth-feature">
              <span>✓</span>
              Better campus experience
            </div>

          </div>

          <div className="campus-visual">

            <div className="campus-building">
              🏫
            </div>

            <div className="visual-text">
              <strong>Build a Better Campus</strong>
              <span>Every complaint makes a difference.</span>
            </div>

          </div>

        </div>

        <div className="auth-footer">
          © 2026 FixMyCampus. All rights reserved.
        </div>

      </section>

      {/* RIGHT AUTHENTICATION PANEL */}
      <section className="auth-right">

        <div className="auth-form-wrapper">

          <div className="form-heading">

            <div className="form-heading-icon">
              {isRegister ? "👤" : "🎓"}
            </div>

            <span className="auth-form-tag">
              STUDENT PORTAL
            </span>

            <h1>
              {isRegister
                ? "Create Account"
                : "Welcome Back!"}
            </h1>

            <p>
              {isRegister
                ? "Join us in making your campus better."
                : "Sign in to continue to your account."}
            </p>

          </div>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >

            {isRegister && (
              <>
                <div className="auth-input-group">
                  <label>Full Name</label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="auth-input-group">
                  <label>Department</label>

                  <input
                    type="text"
                    name="department"
                    placeholder="Example: CSE"
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>

                <div className="auth-input-group">
                  <label>Phone Number</label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="auth-input-group">
              <label>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-input-group">
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

              {isRegister && (
                <span className="password-hint">
                  Password must contain at least 6 characters.
                </span>
              )}
            </div>

            <button
              className="auth-submit-button"
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
              <div className="auth-message">
                {message}
              </div>
            )}

          </form>

          <div className="auth-switch">

            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setMessage("");
              }}
            >
              {isRegister ? "Sign In" : "Register Now"}
            </button>

          </div>

          <div className="auth-security">
            🔒 Your account information is securely protected.
          </div>

        </div>

      </section>

    </div>
  );
}

export default App;
