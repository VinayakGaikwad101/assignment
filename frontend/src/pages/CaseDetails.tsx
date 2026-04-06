import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseService, taskService } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { type Case, type Task } from "../types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Calendar,
  User,
  Edit3,
  X,
  Zap,
} from "lucide-react";

const CaseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);
  const [taskFormData, setTaskFormData] = useState({
    title: "",
    dueDate: "",
    ownerName: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const fetchData = useCallback(
    async (silent = false) => {
      if (!id) return;
      try {
        if (!silent) setLoading(true);
        const [caseRes, taskRes] = await Promise.all([
          caseService.getById(id),
          taskService.getByCase(id),
        ]);
        setCaseData(caseRes.data.data);
        setTasks(taskRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [id],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleQuickStageUpdate = async (newStage: string) => {
    const GQL_MUTATION = `
      mutation UpdateStage($id: ID!, $stage: String!) {
        updateCaseStage(id: $id, stage: $stage) { id stage }
      }
    `;
    try {
      await fetch("http://localhost:5000/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: GQL_MUTATION,
          variables: { id, stage: newStage },
        }),
      });
      fetchData(true);
    } catch (err) {
      alert("GraphQL Update Failed");
    }
  };

  const handleTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTask) await taskService.update(editingTask._id, taskFormData);
      else await taskService.create(id!, taskFormData);
      setShowTaskForm(false);
      setEditingTask(null);
      setTaskFormData({
        title: "",
        dueDate: "",
        ownerName: "",
        priority: "Medium",
      });
      fetchData(true);
    } catch (err) {
      alert("Save failed");
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      await taskService.toggleStatus(taskId);
      fetchData(true);
    } catch (err) {
      alert("Update failed");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      await taskService.delete(deleteTaskId);
      setDeleteTaskId(null);
      fetchData(true);
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-black">LOADING...</div>
    );
  if (!caseData)
    return (
      <div className="p-10 text-center font-black text-black">NOT FOUND</div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/cases")}
        className="flex items-center gap-2 text-gray-400 hover:text-black font-black mb-6 uppercase text-xs tracking-widest transition-colors"
      >
        <ArrowLeft size={16} /> Back to cases
      </button>

      <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-black leading-tight tracking-tighter">
            {caseData.caseTitle}
          </h1>
          <p className="text-gray-400 font-bold uppercase text-[10px] mt-2 tracking-[0.2em]">
            {caseData.caseType} // {caseData.courtName}
          </p>

          <div className="flex gap-2 mt-6">
            {["Filing", "Evidence", "Arguments", "Order Reserved"].map((s) => (
              <button
                key={s}
                onClick={() => handleQuickStageUpdate(s)}
                className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${caseData.stage === s ? "bg-black text-white shadow-lg" : "bg-gray-50 text-gray-400 hover:bg-gray-100"}`}
              >
                {s}
              </button>
            ))}
            <div className="flex items-center gap-1 ml-2 text-blue-600 animate-pulse">
              <Zap size={12} fill="currentColor" />{" "}
              <span className="text-[8px] font-black uppercase">GQL LIVE</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="px-4 py-2 rounded-xl text-[10px] font-black bg-blue-50 text-blue-600 uppercase tracking-widest border border-blue-100">
            {caseData.stage}
          </span>
          <p className="text-xl font-black mt-4 text-black">
            {new Date(caseData.nextHearingDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter text-black flex items-center gap-3">
          <CheckCircle size={24} className="text-gray-300" /> Preparation
          Tracker
        </h2>
        <button
          onClick={() => {
            setEditingTask(null);
            setTaskFormData({
              title: "",
              dueDate: "",
              ownerName: "",
              priority: "Medium",
            });
            setShowTaskForm(true);
          }}
          className="bg-black text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 text-xs shadow-xl active:scale-95 transition-all"
        >
          <Plus size={18} /> NEW TASK
        </button>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`flex items-center justify-between p-6 bg-white border-2 rounded-3xl transition-all ${task.status === "Completed" ? "border-green-500 bg-green-50/20" : "border-gray-100 shadow-sm"}`}
          >
            <div className="flex items-center gap-6">
              <button
                onClick={() => handleToggleStatus(task._id)}
                className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all shadow-sm ${task.status === "Completed" ? "bg-green-600 border-green-600 text-white" : "bg-white border-gray-200 text-transparent hover:border-black"}`}
              >
                <CheckCircle size={28} strokeWidth={3} />
              </button>
              <div>
                <h4
                  className={`text-xl font-black ${task.status === "Completed" ? "text-green-800/40 line-through" : "text-black"}`}
                >
                  {task.title}
                </h4>
                <div className="flex gap-6 mt-2 text-[11px] text-gray-400 font-black uppercase tracking-widest">
                  <span className="flex items-center gap-1.5">
                    <User size={14} /> {task.ownerName}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-md ${task.priority === "High" ? "bg-red-600 text-white" : "bg-gray-100 text-gray-500"}`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingTask(task);
                  setTaskFormData({
                    title: task.title,
                    dueDate: new Date(task.dueDate).toISOString().split("T")[0],
                    ownerName: task.ownerName,
                    priority: task.priority,
                  });
                  setShowTaskForm(true);
                }}
                className="p-4 bg-gray-50 text-gray-400 rounded-2xl hover:bg-black hover:text-white transition-all"
              >
                <Edit3 size={20} />
              </button>
              {isAdmin && (
                <button
                  onClick={() => setDeleteTaskId(task._id)}
                  className="p-4 bg-red-50 text-red-600 rounded-2xl hover:bg-red-600 hover:text-white transition-all"
                >
                  <Trash2 size={20} />
                </button>
              )}
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="text-center py-24 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200 text-gray-300 font-black uppercase tracking-[0.3em]">
            No Tasks Active
          </div>
        )}
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <form
            onSubmit={handleTaskSubmit}
            className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl space-y-6 relative border border-gray-100"
          >
            <button
              type="button"
              onClick={() => setShowTaskForm(false)}
              className="absolute right-8 top-8 text-gray-300 hover:text-black transition-colors"
            >
              <X size={28} />
            </button>
            <h3 className="text-3xl font-black uppercase tracking-tighter text-black">
              {editingTask ? "Update" : "Create"} Task
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                required
                placeholder="Task Description"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none"
                value={taskFormData.title}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, title: e.target.value })
                }
              />
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none"
                value={taskFormData.dueDate}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, dueDate: e.target.value })
                }
              />
              <input
                type="text"
                required
                placeholder="Assignee Name"
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none"
                value={taskFormData.ownerName}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    ownerName: e.target.value,
                  })
                }
              />
              <select
                className="w-full px-5 py-4 bg-gray-50 border-none rounded-2xl font-bold text-black focus:ring-2 focus:ring-black outline-none appearance-none"
                value={taskFormData.priority}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    priority: e.target.value as any,
                  })
                }
              >
                <option value="Low">Low Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="High">High Priority</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-5 bg-black text-white rounded-3xl font-black uppercase text-sm tracking-widest shadow-2xl hover:bg-gray-800 transition-all active:scale-95"
            >
              Save Task Record
            </button>
          </form>
        </div>
      )}

      {deleteTaskId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-[60] backdrop-blur-md">
          <div className="bg-white rounded-[40px] p-10 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="bg-red-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-600">
              <Trash2 size={40} />
            </div>
            <h2 className="text-3xl font-black text-black mb-2 uppercase tracking-tighter">
              Delete?
            </h2>
            <p className="text-gray-400 mb-10 font-bold leading-relaxed">
              This action is permanent and cannot be reversed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-black text-gray-400 uppercase text-[10px] tracking-widest hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-red-100 hover:bg-red-700 transition-colors"
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

export default CaseDetails;
