import Sidebar from "./Sidebar";
import TopNav from "./TopNav";
import React, { useState, useEffect } from "react";

function AddBookModal({ open, onClose, onAdd, token }) {
  const [form, setForm] = useState({ title: "", authors: "", description: "", cover: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) setForm({ title: "", authors: "", description: "", cover: "" });
  }, [open]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const payload = {
        title: form.title,
        authors: form.authors.split(",").map(a => a.trim()).filter(Boolean),
        cover: form.cover,
        description: form.description
      };
      const res = await fetch("/api/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to add book");
      onAdd();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
        <h3 className="text-xl font-bold mb-4">Add Book</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded" required />
          <input name="authors" value={form.authors} onChange={handleChange} placeholder="Authors (comma separated)" className="w-full px-3 py-2 border rounded" required />
          <input name="cover" value={form.cover} onChange={handleChange} placeholder="Cover URL" className="w-full px-3 py-2 border rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={loading}>{loading ? "Adding..." : "Add Book"}</button>
        </form>
      </div>
    </div>
  );
}

function EditBookModal({ open, onClose, onEdit, token, book }) {
  const [form, setForm] = useState({ title: "", author: "", description: "", coverUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open && book) setForm({ title: book.title, author: book.author, description: book.description, coverUrl: book.coverUrl });
  }, [open, book]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/book/${book.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to update book");
      onEdit();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700">&times;</button>
        <h3 className="text-xl font-bold mb-4">Edit Book</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Title" className="w-full px-3 py-2 border rounded" required />
          <input name="author" value={form.author} onChange={handleChange} placeholder="Author" className="w-full px-3 py-2 border rounded" required />
          <input name="coverUrl" value={form.coverUrl} onChange={handleChange} placeholder="Cover URL" className="w-full px-3 py-2 border rounded" />
          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="w-full px-3 py-2 border rounded" />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button type="submit" className="w-full py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        </form>
      </div>
    </div>
  );
}

export default function Admin() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editBook, setEditBook] = useState(null);
  const userRole = localStorage.getItem('role') || 'User';
  const token = localStorage.getItem('token');

  const fetchBooks = async () => {
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
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      const res = await fetch(`/api/book/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete book");
      fetchBooks();
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    if (userRole !== 'Admin') return;
    fetchBooks();
    // eslint-disable-next-line
  }, [token, userRole]);

  if (userRole !== 'Admin') {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 flex flex-col">
          <TopNav title="Admin" />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-2xl text-red-600 font-bold bg-white rounded-xl shadow p-10">This area is for admins only.</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <TopNav title="Admin" />
        <div className="p-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Book Management</h2>
            <button className="px-4 py-2 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition" onClick={() => setShowAdd(true)}>Add Book</button>
          </div>
          {loading && <div>Loading books...</div>}
          {error && <div className="text-red-600">{error}</div>}
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Author</th>
                  <th className="px-4 py-2 text-left">Description</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.id} className="border-t">
                    <td className="px-4 py-2 font-semibold">{book.title}</td>
                    <td className="px-4 py-2">{book.author}</td>
                    <td className="px-4 py-2 max-w-xs truncate">{book.description}</td>
                    <td className="px-4 py-2 flex gap-2">
                      <button className="px-3 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500" onClick={() => { setEditBook(book); setShowEdit(true); }}>Edit</button>
                      <button className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600" onClick={() => handleDelete(book.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <AddBookModal open={showAdd} onClose={() => setShowAdd(false)} onAdd={fetchBooks} token={token} />
        <EditBookModal open={showEdit} onClose={() => setShowEdit(false)} onEdit={fetchBooks} token={token} book={editBook} />
      </main>
    </div>
  );
} 