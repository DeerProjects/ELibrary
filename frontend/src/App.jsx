import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import Books from "./components/Books";
import Profile from "./components/Profile";
import Admin from "./components/Admin";
import BookDetails from "./components/BookDetails";
import React from "react";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthForm />} />
      <Route path="/books" element={<Books />} />
      <Route path="/books/:id" element={<BookDetails />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}