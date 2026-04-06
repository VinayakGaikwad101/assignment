import React, { useEffect, useState, useCallback } from "react";
import { caseService } from "../services/api";
import { type Case } from "../types";
import { Search, Filter, Trash2, Edit3, Plus, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

const CaseList: React.FC = () => {
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("");

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchCases = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: search || undefined,
        stage: stage || undefined,
      };
      const response = await caseService.getAll(params);
      setCases(response.data.data);
    } catch (error) {
      console.error("Failed to fetch cases", error);
    } finally {
      setLoading(false);
    }
  }, [search, stage]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchCases();
      //   we are going to debounce this fetch
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
        <h1 className="text-3xl font-black text-black">Case Records</h1>
        <Link
          to="/cases/new"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-all"
        >
          <Plus size={20} /> New Case
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6 flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 min-w-75">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search by title or client name..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-black font-medium"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 outline-none font-medium text-black bg-white"
            value={stage}
            onChange={(e) => setStage(e.target.value)}
          >
            <option value="">All Stages</option>
            <option value="Filing">Filing</option>
            <option value="Evidence">Evidence</option>
            <option value="Arguments">Arguments</option>
            <option value="Order Reserved">Order Reserved</option>
          </select>
          {(search || stage) && (
            <button
              onClick={() => {
                setSearch("");
                setStage("");
              }}
              className="text-sm text-blue-600 font-bold hover:underline ml-2"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Case Details
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Client
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Stage
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">
                Next Hearing
              </th>
              <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  Loading cases...
                </td>
              </tr>
            ) : cases.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-gray-500"
                >
                  No cases found matching your criteria.
                </td>
              </tr>
            ) : (
              cases.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-bold text-black">{c.caseTitle}</p>
                    <p className="text-sm text-gray-500">
                      {c.caseType} • {c.courtName}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-700">
                    {c.clientName}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700 uppercase">
                      {c.stage}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                    {new Date(c.nextHearingDate).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      to={`/cases/${c._id}`}
                      className="inline-block p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                      <Edit3 size={18} />
                    </Link>
                    <button
                      onClick={() => setDeleteId(c._id)}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertCircle size={24} />
              <h3 className="text-xl font-black">Confirm Delete</h3>
            </div>
            <p className="text-gray-600 mb-6 font-medium">
              Are you sure you want to delete this case? All associated hearing
              tasks will be removed permanently.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg font-bold text-gray-600 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700"
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
