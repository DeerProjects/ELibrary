import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

const fallbackCover = "https://via.placeholder.com/128x176?text=No+Cover";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

export default function BookDetails() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState("");
  const [actionSuccess, setActionSuccess] = useState("");
  const token = localStorage.getItem('token');
  const userId = token ? parseJwt(token)?.sub || parseJwt(token)?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/nameidentifier"] : null;
  const navigate = useNavigate();

  const fetchBook = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/book/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch book");
      const data = await res.json();
      setBook(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBook();
    // eslint-disable-next-line
  }, [id, token]);

  const handleBorrow = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/book/${id}/borrow`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to borrow book");
      setActionSuccess("Book borrowed successfully!");
      fetchBook();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturn = async () => {
    setActionLoading(true);
    setActionError("");
    setActionSuccess("");
    try {
      const res = await fetch(`/api/book/${id}/return`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to return book");
      setActionSuccess("Book returned successfully!");
      fetchBook();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Book status logic
  const isAvailable = book && book.status === 0; // BookStatus.Available
  const isBorrowed = book && book.status === 1;
  const isBorrowedByMe = isBorrowed && book.borrowedByUserId && userId && (book.borrowedByUserId.toLowerCase() === userId.toLowerCase());

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TopNav title="Book Details" />
        <div className="p-10 max-w-2xl mx-auto w-full">
          <button onClick={() => navigate(-1)} className="mb-6 text-blue-600 hover:underline">&larr; Back</button>
          {loading && <div>Loading book...</div>}
          {error && <div className="text-red-600">{error}</div>}
          {book && (
            <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center w-full">
              <img
                src={book.cover || fallbackCover}
                alt={book.title}
                className="w-48 h-64 object-cover rounded mb-6 shadow"
                onError={e => { e.target.onerror = null; e.target.src = fallbackCover; }}
              />
              <div className="text-3xl font-bold mb-2 text-center">{book.title}</div>
              {book.authors && book.authors.length > 0 && (
                <div className="text-lg text-blue-700 mb-4 text-center font-semibold">
                  {book.authors.join(", ")}
                </div>
              )}
              <div className="text-base text-gray-700 mb-6 text-center whitespace-pre-line max-w-xl">{book.description || <span className="italic text-gray-400">No description available.</span>}</div>
              {actionError && <div className="text-red-600 mb-2">{actionError}</div>}
              {actionSuccess && <div className="text-green-600 mb-2">{actionSuccess}</div>}
              {isAvailable && (
                <button onClick={handleBorrow} disabled={actionLoading} className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold text-lg">
                  {actionLoading ? "Borrowing..." : "Borrow"}
                </button>
              )}
              {isBorrowedByMe && (
                <button onClick={handleReturn} disabled={actionLoading} className="px-8 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold text-lg">
                  {actionLoading ? "Returning..." : "Return"}
                </button>
              )}
              {isBorrowed && !isBorrowedByMe && (
                <div className="text-gray-500 mt-2 font-semibold">
                  This book is currently borrowed.
                  {book.borrowedByUsername && (
                    <span> Borrowed by: <span className="text-blue-700">{book.borrowedByUsername}</span></span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 