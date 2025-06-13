import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import React, { useState } from "react";

export default function Profile() {
  const [form, setForm] = useState({
    username: "exampleuser",
    email: "user@example.com",
    password: "password123"
  });
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TopNav title="Profile" />
        <div className="p-10 max-w-xl mx-auto w-full">
          <div className="text-3xl font-bold mb-8">Profile</div>
          <form className="space-y-6">
            <div>
              <label className="block text-gray-700 mb-2">Username</label>
              <input type="text" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base" value={form.username} onChange={e => setForm(f => ({ ...f, username: e.target.value }))} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Email</label>
              <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-gray-700 mb-2">Password</label>
              <input type="password" className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base" value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
            <button type="submit" className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg text-base hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 mt-4">Update Profile</button>
          </form>
        </div>
      </main>
    </div>
  );
} 