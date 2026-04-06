import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, LayoutDashboard, Briefcase, PlusCircle } from "lucide-react";

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) =>
    location.pathname === path
      ? "bg-black text-white shadow-md"
      : "text-gray-500 hover:bg-gray-100 hover:text-black";

  return (
    <nav className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="bg-black p-2.5 rounded-xl text-white shadow-lg">
          <Scale size={22} strokeWidth={2.5} />
        </div>
        <div>
          <span className="text-xl font-black tracking-tighter text-black uppercase block leading-none">
            Legixo
          </span>
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">
            Thinklabs
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
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

        <Link
          to="/cases/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-lg shadow-blue-100 active:scale-95"
        >
          <PlusCircle size={16} /> NEW INTAKE
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
