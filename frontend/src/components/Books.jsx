import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const fallbackCover = "https://via.placeholder.com/128x176?text=No+Cover";

export default function Books() {
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userRole = localStorage.getItem('role') || 'User';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/book", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("Failed to fetch books");
        const data = await res.json();
        setBooks(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, [token]);

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.authors && b.authors.some(author => author.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TopNav title="Books" />
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <input
              type="text"
              placeholder="Search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full max-w-xl px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
            />
            <span className="ml-6 px-4 py-2 bg-blue-100 text-blue-800 rounded font-semibold">Role: {userRole}</span>
            {userRole === 'Admin' && (
              <button className="ml-6 px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition">Add Book</button>
            )}
          </div>
          {loading && <div>Loading books...</div>}
          {error && <div className="text-red-600">{error}</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredBooks.map((book, i) => (
              <div
                key={book.id || i}
                className="bg-white rounded-xl shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-lg transition"
                onClick={() => navigate(`/books/${book.id}`)}
                title="View details"
              >
                <img
                  src={book.cover || fallbackCover}
                  alt={book.title}
                  className="w-32 h-44 object-cover rounded mb-4"
                  onError={e => { e.target.onerror = null; e.target.src = fallbackCover; }}
                />
                <div className="font-semibold text-lg text-center">{book.title}</div>
                {book.authors && book.authors.length > 0 && (
                  <div className="text-gray-600 text-sm text-center mb-2">{book.authors.join(", ")}</div>
                )}
                {book.description && <div className="text-gray-500 text-xs text-center mt-2">{book.description}</div>}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
} 