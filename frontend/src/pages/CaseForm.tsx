import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { caseService } from "../services/api";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

const CaseForm: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    caseTitle: "",
    clientName: "",
    courtName: "",
    caseType: "",
    nextHearingDate: "",
    stage: "Filing",
    notes: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isEdit && id) {
      const fetchCase = async () => {
        try {
          const res = await caseService.getById(id);
          const data = res.data.data;
          setFormData({
            ...data,
            nextHearingDate: new Date(data.nextHearingDate)
              .toISOString()
              .split("T")[0],
          });
        } catch (err) {
          setError("Could not load case details.");
        }
      };
      fetchCase();
    }
  }, [id, isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (formData.caseTitle.trim().length < 3) {
      setError("Case Title must be at least 3 characters long.");
      return;
    }
    try {
      setLoading(true);
      if (isEdit && id) {
        await caseService.update(id, formData);
      } else {
        await caseService.create(formData);
      }
      navigate("/cases");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "An error occurred while saving.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto h-full">
      <button
        onClick={() => navigate("/cases")}
        className="flex items-center gap-2 text-gray-600 hover:text-black font-bold mb-4 transition-colors"
      >
        <ArrowLeft size={18} /> Back to Cases
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <h1 className="text-xl font-black text-black m-0">
            {isEdit ? "Edit Case Record" : "New Case Intake"}
          </h1>
          <p className="text-sm text-gray-500 font-medium m-0">
            Fill in the judicial details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg flex items-center gap-2 text-sm font-medium">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-black text-black uppercase mb-1">
                Case Title *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.caseTitle}
                onChange={(e) =>
                  setFormData({ ...formData, caseTitle: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">
                Client Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.clientName}
                onChange={(e) =>
                  setFormData({ ...formData, clientName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">
                Court Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.courtName}
                onChange={(e) =>
                  setFormData({ ...formData, courtName: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">
                Case Type *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.caseType}
                onChange={(e) =>
                  setFormData({ ...formData, caseType: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-xs font-black text-black uppercase mb-1">
                Next Hearing *
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.nextHearingDate}
                onChange={(e) =>
                  setFormData({ ...formData, nextHearingDate: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-black uppercase mb-1">
                Stage *
              </label>
              <select
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black bg-white text-sm"
                value={formData.stage}
                onChange={(e) =>
                  setFormData({ ...formData, stage: e.target.value })
                }
              >
                <option value="Filing">Filing</option>
                <option value="Evidence">Evidence</option>
                <option value="Arguments">Arguments</option>
                <option value="Order Reserved">Order Reserved</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-black text-black uppercase mb-1">
                Notes
              </label>
              <textarea
                rows={3}
                maxLength={1000}
                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-medium text-black text-sm"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-2 rounded-lg font-black flex items-center justify-center gap-2 transition-all disabled:bg-gray-400 text-sm"
            >
              <Save size={18} />
              {loading ? "Saving..." : isEdit ? "Update Case" : "Register Case"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseForm;
