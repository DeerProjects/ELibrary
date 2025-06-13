import { NavLink } from "react-router-dom";

export default function TopNav({ title }) {
  return (
    <header className="flex items-center justify-between px-10 py-6 border-b border-gray-200 bg-white">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <nav className="flex gap-8">
        <NavLink to="/books" className={({isActive}) => isActive ? "text-blue-700 font-semibold" : "text-gray-800 hover:text-blue-700 font-semibold"}>Books</NavLink>
        <NavLink to="/admin" className={({isActive}) => isActive ? "text-blue-700 font-semibold" : "text-gray-800 hover:text-blue-700 font-semibold"}>Admin</NavLink>
        <NavLink to="/profile" className={({isActive}) => isActive ? "text-blue-700 font-semibold" : "text-gray-800 hover:text-blue-700 font-semibold"}>Profile</NavLink>
      </nav>
    </header>
  );
} 