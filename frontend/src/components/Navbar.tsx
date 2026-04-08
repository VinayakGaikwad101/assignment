import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Scale,
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  ShieldCheck,
  UserCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const location = useLocation();
  const { role, toggleRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-black text-white shadow-md"
      : "text-gray-500 hover:bg-gray-100 hover:text-black";

  return (
    <nav className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-black p-2 md:p-2.5 rounded-xl text-white shadow-lg">
            <Scale size={20} className="md:w-[22px]" strokeWidth={2.5} />
          </div>
          <div>
            <span className="text-lg md:text-xl font-black tracking-tighter text-black uppercase block leading-none">
              Legixo
            </span>
            <span className="text-[8px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
              Thinklabs Assignment
            </span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2">
          <Link
            to="/"
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 tracking-widest ${isActive("/")}`}
          >
            <LayoutDashboard size={16} /> DASHBOARD
          </Link>

          <Link
            to="/cases"
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 tracking-widest ${isActive("/cases")}`}
          >
            <Briefcase size={16} /> CASES
          </Link>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <button
            onClick={toggleRole}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border-2 ${
              role === "Admin"
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-gray-50 text-gray-500"
            }`}
          >
            {role === "Admin" ? (
              <ShieldCheck size={14} />
            ) : (
              <UserCircle size={14} />
            )}
            {role}
          </button>

          <div className="h-6 w-px bg-gray-200 mx-2" />

          <Link
            to="/cases/new"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
          >
            <PlusCircle size={16} /> NEW INTAKE
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-black"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden mt-4 pb-4 flex flex-col gap-3 animate-in slide-in-from-top duration-300">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className={`px-5 py-3 rounded-xl text-xs font-black flex items-center gap-3 ${isActive("/")}`}
          >
            <LayoutDashboard size={18} /> DASHBOARD
          </Link>

          <Link
            to="/cases"
            onClick={() => setIsOpen(false)}
            className={`px-5 py-3 rounded-xl text-xs font-black flex items-center gap-3 ${isActive("/cases")}`}
          >
            <Briefcase size={18} /> CASES
          </Link>

          <button
            onClick={() => {
              toggleRole();
              setIsOpen(false);
            }}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl font-black text-xs uppercase transition-all border-2 ${
              role === "Admin"
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-gray-50 text-gray-500"
            }`}
          >
            {role === "Admin" ? (
              <ShieldCheck size={18} />
            ) : (
              <UserCircle size={18} />
            )}
            ROLE: {role}
          </button>

          <Link
            to="/cases/new"
            onClick={() => setIsOpen(false)}
            className="bg-blue-600 text-white px-5 py-3 rounded-xl text-xs font-black flex items-center gap-3 shadow-lg"
          >
            <PlusCircle size={18} /> NEW INTAKE
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
