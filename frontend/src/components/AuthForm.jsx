import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Logo() {
  return (
    <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mr-2">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <rect width="24" height="24" rx="6" fill="currentColor" />
        <path d="M7 8.5V16a1 1 0 0 0 1 1h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 8.5V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  );
}

function Input({ icon, ...props }) {
  return (
    <div className="mb-4 relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">{icon}</span>
      <input
        {...props}
        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
      />
    </div>
  );
}

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function AuthForm() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "Student",
    remember: false,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({
      ...f,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (mode === "register" && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const endpoint =
        mode === "login" ? "http://localhost:5250/api/auth/login" : "http://localhost:5250/api/auth/register";
      const payload =
        mode === "login"
          ? { username: form.username, password: form.password }
          : {
              username: form.username,
              password: form.password,
              role: form.role,
            };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      let data = {};
      try {
        data = await res.json();
      } catch (e) {
        console.error("Error parsing response:", e);
      }
      
      if (!res.ok) {
        console.error("Login failed:", data);
        throw new Error(data.message || "Invalid username or password");
      }
      setSuccess(
        mode === "login"
          ? "Login successful! Redirecting..."
          : "Registration successful! You can now log in."
      );
      // Save token, role, redirect, etc. here
      if (mode === "login") {
        if (data && data.token) {
          localStorage.setItem('token', data.token);
          // Decode token to get role
          const payload = parseJwt(data.token);
          if (payload && payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
            localStorage.setItem('role', payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]);
          } else if (payload && payload.role) {
            localStorage.setItem('role', payload.role);
          }
        }
        setTimeout(() => {
          navigate("/books");
        }, 1000);
      } else if (mode === "register" && data && data.role) {
        localStorage.setItem('role', data.role);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-10 flex flex-col items-center">
        <div className="flex items-center mb-4">
          <Logo />
          <span className="text-3xl font-bold text-gray-800">eLibrary</span>
        </div>
        <div className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {mode === "login" ? "Welcome back to eLibrary" : "Create an account"}
        </div>
        <form className="w-full" onSubmit={handleSubmit}>
          {mode === "register" && (
            <Input
              type="text"
              name="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              icon={
                <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5">
                  <path stroke="currentColor" strokeWidth="1.5" d="M15.75 7.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 19.5a7.5 7.5 0 1115 0v.75a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75v-.75z"/>
                </svg>
              }
              required
              autoFocus
            />
          )}
          {mode === "register" && (
            <Input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              icon={
                <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5">
                  <path stroke="currentColor" strokeWidth="1.5" d="M21 7.5v9a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 16.5v-9A2.25 2.25 0 015.25 5.25h13.5A2.25 2.25 0 0121 7.5z"/>
                  <path stroke="currentColor" strokeWidth="1.5" d="M3.75 6.75l7.5 6.75 7.5-6.75"/>
                </svg>
              }
              required
            />
          )}
          {mode === "register" && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                required
              >
                <option value="Student">Student</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          )}
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            icon={
              <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5">
                <path stroke="currentColor" strokeWidth="1.5" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z"/>
                <path stroke="currentColor" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            icon={
              <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5">
                <path stroke="currentColor" strokeWidth="1.5" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z"/>
                <path stroke="currentColor" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            }
            required
          />
          {mode === "register" && (
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm password"
              value={form.confirmPassword}
              onChange={handleChange}
              icon={
                <svg fill="none" viewBox="0 0 24 24" className="w-5 h-5">
                  <path stroke="currentColor" strokeWidth="1.5" d="M12 15.75a3 3 0 100-6 3 3 0 000 6z"/>
                  <path stroke="currentColor" strokeWidth="1.5" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              }
              required
            />
          )}
          {mode === "login" && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={form.remember}
                  onChange={handleChange}
                  id="remember"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                Forgot password?
              </a>
            </div>
          )}
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-lg text-base hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mb-6 shadow"
          >
            {mode === "login" ? "Login" : "Register"}
          </button>
          <div className="border-t border-gray-200 my-4" />
          <div className="text-center text-base text-gray-700">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  onClick={() => setMode("register")}
                >
                  Register here
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  onClick={() => setMode("login")}
                >
                  Login
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 