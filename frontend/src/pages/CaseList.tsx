import React, { useEffect, useState, useCallback } from "react";
import { caseService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { type Case } from "../types";
import {
  Search,
  Filter,
  Trash2,
  Edit3,
  Plus,
  Calendar,
  Eye,
} from "lucide-react";
import { Link } from "react-router-dom";

const STAGE_COLORS: Record<string, string> = {
  Filing: "bg-purple-100 text-purple-700 border-purple-200",
  Evidence: "bg-blue-100 text-blue-700 border-blue-200",
  Arguments: "bg-amber-100 text-amber-700 border-amber-200",
  "Order Reserved": "bg-emerald-100 text-emerald-700 border-emerald-200",
};

const CaseList: React.FC = () => {
  const { isAdmin } = useAuth();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        stage: stage || undefined,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      };
      const response = await caseService.getAll(params);
      setCases(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [search, stage, startDate, endDate]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCases();
    }, 300);
    return () => clearTimeout(debounce);
  }, [fetchCases]);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await caseService.delete(deleteId);
      setCases(cases.filter((c) => c._id !== deleteId));
      setDeleteId(null);
    } catch (error) {
      alert("Failed to delete case.");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-black uppercase tracking-tight">
          Case Records
        </h1>
        <Link
          to="/cases/new"
          className="bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> NEW CASE
        </Link>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative flex-1 min-w-[300px]">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by title or client name..."
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:border-black outline-none text-black font-bold transition-colors"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 bg-gray-50 px-4 py-3 rounded-xl border border-gray-100">
            <Filter size={18} className="text-gray-400" />
            <select
              className="bg-transparent outline-none font-bold text-black text-sm uppercase cursor-pointer"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="">ALL STAGES</option>
              {Object.keys(STAGE_COLORS).map((s) => (
                <option key={s} value={s}>
                  {s.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-wrap gap-4 items-center border-t border-gray-50 pt-4">
          <div className="flex items-center gap-3">
            <Calendar size={16} className="text-gray-400" />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Hearing Range:
            </span>
            <input
              type="date"
              className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold text-black focus:border-black outline-none"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span className="text-gray-300 font-bold text-xs uppercase">
              to
            </span>
            <input
              type="date"
              className="bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 text-xs font-bold text-black focus:border-black outline-none"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          {(search || stage || startDate || endDate) && (
            <button
              onClick={() => {
                setSearch("");
                setStage("");
                setStartDate("");
                setEndDate("");
              }}
              className="text-xs text-red-500 font-black hover:text-red-700 uppercase tracking-widest ml-auto transition-colors"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Case & Court
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Client
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Stage
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                Hearing Date
              </th>
              <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest animate-pulse"
                >
                  Loading data...
                </td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest"
                >
                  No cases found
                </td>
              </tr>
            ) : (
              cases.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <Link
                      to={`/cases/${c._id}`}
                      className="font-black text-black hover:text-blue-600 transition-colors block leading-tight mb-1"
                    >
                      {c.caseTitle}
                    </Link>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                      {c.caseType} // {c.courtName}
                    </span>
                  </td>
                  <td className="px-8 py-6 font-bold text-gray-700">
                    {c.clientName}
                  </td>
                  <td className="px-8 py-6">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${STAGE_COLORS[c.stage] || "bg-gray-100 text-gray-600 border-gray-200"}`}
                    >
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-black">
                    {new Date(c.nextHearingDate).toLocaleDateString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-2">
                      <Link
                        to={`/cases/${c._id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 text-gray-700 rounded-xl font-black text-[10px] hover:bg-black hover:text-white transition-all uppercase tracking-tighter"
                      >
                        <Eye size={14} /> View
                      </Link>
                      <Link
                        to={`/cases/${c._id}/edit`}
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-600 rounded-xl font-black text-[10px] hover:bg-blue-600 hover:text-white transition-all uppercase tracking-tighter"
                      >
                        <Edit3 size={14} /> Edit
                      </Link>
                      {isAdmin && (
                        <button
                          onClick={() => setDeleteId(c._id)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-600 rounded-xl font-black text-[10px] hover:bg-red-600 hover:text-white transition-all uppercase tracking-tighter"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-70 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 w-full max-w-90 shadow-2xl text-center border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="bg-red-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-red-600">
              <Trash2 size={32} strokeWidth={2.5} />
            </div>

            <h3 className="text-xl font-black text-black mb-2 uppercase tracking-tighter">
              Confirm Delete
            </h3>

            <p className="text-gray-500 mb-8 font-bold text-sm leading-relaxed px-2">
              This action is permanent. All associated tasks for this case will
              be lost.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase text-[10px] tracking-widest"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black hover:bg-red-700 transition-all uppercase text-[10px] tracking-widest shadow-lg shadow-red-100 active:scale-95"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CaseList;
