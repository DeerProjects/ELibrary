import { NavLink, useNavigate } from "react-router-dom";
import React from "react";

export default function Sidebar() {
  const userRole = localStorage.getItem('role') || 'User';
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <aside className="bg-blue-900 text-white w-56 min-h-screen flex flex-col justify-between">
      <div>
        <div className="flex items-center px-6 py-6">
          <span className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl mr-2">
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <rect width="24" height="24" rx="6" fill="currentColor" />
              <path d="M7 8.5V16a1 1 0 0 0 1 1h8" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M7 8.5V7a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1v-1.5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-2xl font-bold">eLibrary</span>
        </div>
        <nav className="flex flex-col gap-2 px-4 mt-8">
          <NavLink to="/books" className={({isActive}) => isActive ? "bg-blue-800 rounded px-3 py-2 font-semibold" : "px-3 py-2 font-semibold hover:bg-blue-800 rounded"}>Books</NavLink>
          {userRole === 'Admin' ? (
            <NavLink to="/admin" className={({isActive}) => isActive ? "bg-blue-800 rounded px-3 py-2 font-semibold" : "px-3 py-2 font-semibold hover:bg-blue-800 rounded"}>Admin</NavLink>
          ) : (
            <span className="px-3 py-2 font-semibold text-blue-300 cursor-not-allowed select-none">Admin</span>
          )}
          <NavLink to="/profile" className={({isActive}) => isActive ? "bg-blue-800 rounded px-3 py-2 font-semibold" : "px-3 py-2 font-semibold hover:bg-blue-800 rounded"}>Profile</NavLink>
        </nav>
      </div>
      <button onClick={handleLogout} className="m-4 px-4 py-2 bg-red-600 text-white rounded font-semibold hover:bg-red-700 transition">Logout</button>
    </aside>
  );
} 