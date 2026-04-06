import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { caseService, taskService } from "../services/api";
import { type Case, type Task } from "../types";
import {
  ArrowLeft,
  Plus,
  Trash2,
  CheckCircle,
  Circle,
  Calendar,
  User,
} from "lucide-react";

const CaseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState<Case | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [deleteTaskId, setDeleteTaskId] = useState<string | null>(null);

  const [taskFormData, setTaskFormData] = useState({
    title: "",
    dueDate: "",
    ownerName: "",
    priority: "Medium" as "Low" | "Medium" | "High",
  });

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
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
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await taskService.create(id, taskFormData);
      setTaskFormData({
        title: "",
        dueDate: "",
        ownerName: "",
        priority: "Medium",
      });
      setShowTaskForm(false);
      fetchData();
    } catch (err) {
      alert("Error creating task");
    }
  };

  const handleToggleStatus = async (taskId: string) => {
    try {
      await taskService.toggleStatus(taskId);
      fetchData();
    } catch (err) {
      alert("Error updating status");
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTaskId) return;
    try {
      await taskService.delete(deleteTaskId);
      setDeleteTaskId(null);
      fetchData();
    } catch (err) {
      alert("Error deleting task");
    }
  };

  if (loading)
    return (
      <div className="p-10 text-center font-black text-black">LOADING...</div>
    );
  if (!caseData)
    return (
      <div className="p-10 text-center font-black text-black">
        CASE NOT FOUND
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate("/cases")}
        className="flex items-center gap-2 text-gray-600 hover:text-black font-black mb-6 transition-colors"
      >
        <ArrowLeft size={18} /> BACK TO LIST
      </button>

      <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm mb-8">
        <div className="flex justify-between items-start">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-blue-600 text-white uppercase tracking-wider">
              {caseData.stage}
            </span>
            <h1 className="text-4xl font-black text-black mt-4 leading-tight">
              {caseData.caseTitle}
            </h1>
            <p className="text-gray-500 font-black mt-1 uppercase text-sm tracking-widest">
              {caseData.caseType} // {caseData.courtName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
              Next Hearing
            </p>
            <p className="text-2xl font-black text-black">
              {new Date(caseData.nextHearingDate).toLocaleDateString("en-IN")}
            </p>
          </div>
        </div>
        {caseData.notes && (
          <div className="mt-8 p-6 bg-gray-50 rounded-xl text-gray-800 font-bold border-l-8 border-black italic">
            "{caseData.notes}"
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-black uppercase tracking-tight">
          Hearing Preparation Tasks
        </h2>
        <button
          onClick={() => setShowTaskForm(true)}
          className="bg-black text-white px-6 py-2.5 rounded-xl font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-lg active:scale-95"
        >
          <Plus size={20} /> ADD TASK
        </button>
      </div>

      {showTaskForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <form
            onSubmit={handleCreateTask}
            className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-5 border border-gray-100"
          >
            <h3 className="text-2xl font-black text-black text-center mb-2">
              NEW PREP TASK
            </h3>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                Task Title
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-black focus:border-black transition-colors"
                value={taskFormData.title}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, title: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                Due Date
              </label>
              <input
                type="date"
                required
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-black focus:border-black transition-colors"
                value={taskFormData.dueDate}
                onChange={(e) =>
                  setTaskFormData({ ...taskFormData, dueDate: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                Assignee
              </label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-black focus:border-black transition-colors"
                value={taskFormData.ownerName}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    ownerName: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-gray-400 uppercase mb-1 ml-1">
                Priority
              </label>
              <select
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold text-black focus:border-black appearance-none"
                value={taskFormData.priority}
                onChange={(e) =>
                  setTaskFormData({
                    ...taskFormData,
                    priority: e.target.value as any,
                  })
                }
              >
                <option value="Low">LOW</option>
                <option value="Medium">MEDIUM</option>
                <option value="High">HIGH</option>
              </select>
            </div>
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => setShowTaskForm(false)}
                className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase text-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-3 bg-black text-white rounded-xl font-black hover:bg-gray-800 transition-colors uppercase text-sm"
              >
                Create Task
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-gray-100 text-gray-300 font-black text-xl uppercase tracking-widest">
            No Active Tasks
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`flex items-center justify-between p-6 bg-white border-2 rounded-2xl transition-all ${task.status === "Completed" ? "border-green-100 bg-green-50/20 opacity-60" : "border-gray-100 shadow-sm hover:border-black"}`}
            >
              <div className="flex items-center gap-6">
                <button
                  onClick={() => handleToggleStatus(task._id)}
                  className={`${task.status === "Completed" ? "text-green-600" : "text-gray-200 hover:text-black"} transition-all transform hover:scale-110`}
                >
                  {task.status === "Completed" ? (
                    <CheckCircle size={32} strokeWidth={3} />
                  ) : (
                    <Circle size={32} strokeWidth={3} />
                  )}
                </button>
                <div>
                  <h4
                    className={`text-xl font-black ${task.status === "Completed" ? "text-gray-400 line-through" : "text-black"}`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-6 mt-2 text-[11px] text-gray-400 font-black uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <User size={14} /> {task.ownerName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />{" "}
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-black ${task.priority === "High" ? "bg-red-600 text-white" : task.priority === "Medium" ? "bg-black text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDeleteTaskId(task._id)}
                className="text-gray-200 hover:text-red-600 p-2 transition-colors"
              >
                <Trash2 size={24} />
              </button>
            </div>
          ))
        )}
      </div>

      {deleteTaskId && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-60 backdrop-blur-md">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center border border-gray-100">
            <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-600">
              <Trash2 size={40} />
            </div>
            <h3 className="text-2xl font-black text-black mb-2 uppercase">
              Delete Task?
            </h3>
            <p className="text-gray-500 mb-8 font-bold leading-relaxed">
              This action will permanently remove this preparation record. It
              cannot be recovered.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="flex-1 py-3 border-2 border-gray-100 rounded-xl font-black text-gray-400 hover:bg-gray-50 transition-colors uppercase text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
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

export default CaseDetails;
