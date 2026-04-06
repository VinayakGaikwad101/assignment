import React, { useEffect, useState, useCallback } from "react";
import { caseService } from "../services/api";
import { type Case } from "../types";
import { Search, Filter, Trash2, Edit3, Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const CaseList: React.FC = () => {
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
      console.error("Failed to fetch cases", error);
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
          <div className="relative flex-1 min-w-75">
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
              className="bg-transparent outline-none font-bold text-black text-sm uppercase"
              value={stage}
              onChange={(e) => setStage(e.target.value)}
            >
              <option value="">ALL STAGES</option>
              <option value="Filing">FILING</option>
              <option value="Evidence">EVIDENCE</option>
              <option value="Arguments">ARGUMENTS</option>
              <option value="Order Reserved">ORDER RESERVED</option>
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
            <span className="text-gray-300 font-bold">to</span>
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
              className="text-xs text-red-500 font-black hover:underline uppercase tracking-widest ml-auto"
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
                  className="px-8 py-20 text-center text-gray-300 font-black uppercase tracking-widest"
                >
                  Loading...
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
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-8 py-6">
                    <Link
                      to={`/cases/${c._id}`}
                      className="font-black text-black hover:text-blue-600 transition-colors block leading-tight"
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
                    <span className="px-3 py-1 rounded-md text-[10px] font-black bg-black text-white uppercase tracking-wider">
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
                  <td className="px-8 py-6 text-right space-x-2">
                    <Link
                      to={`/cases/${c._id}/edit`}
                      className="inline-block p-2 text-gray-300 hover:text-black transition-colors"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="p-2 text-gray-200 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {deleteId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase">
              Delete Case?
            </h3>
            <p className="text-gray-500 mb-8 font-bold leading-relaxed">
              This will delete the case and all associated tasks permanently.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-black hover:bg-red-700 transition-colors uppercase text-xs"
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
