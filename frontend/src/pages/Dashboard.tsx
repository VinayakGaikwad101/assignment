import React, { useEffect, useState } from "react";
import { dashboardService } from "../services/api";
import { type DashboardData } from "../types";
import { Scale, Calendar, CheckCircle, Clock, AlertCircle } from "lucide-react";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await dashboardService.getSummary();
      setData(response.data.data);
      setError(null);
    } catch (err: any) {
      setError("Failed to load dashboard metrics.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 bg-red-50 rounded-lg m-6">
        <AlertCircle className="mx-auto mb-2" />
        <p>{error}</p>
        <button onClick={fetchStats} className="mt-4 text-blue-600 underline">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-black tracking-tight">
          Legal Operations Overview
        </h1>
        <p className="text-lg font-medium text-gray-600 mt-2">
          Real-time hearing readiness and task tracking.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
            <Scale size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Total Active Cases
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.totalCases || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-orange-50 rounded-lg text-orange-600">
            <Calendar size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">
              Hearings (Next 7 Days)
            </p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.upcomingHearings || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-amber-50 rounded-lg text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.tasks.pending || 0}
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-4">
          <div className="p-3 bg-green-50 rounded-lg text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Tasks Completed</p>
            <p className="text-2xl font-bold text-gray-900">
              {data?.tasks.completed || 0}
            </p>
          </div>
        </div>
      </div>

      {data?.totalCases === 0 && (
        <div className="mt-12 text-center p-16 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <Scale size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-700">No Cases Yet</h3>
          <p className="text-gray-500 max-w-xs mx-auto mt-2">
            Your dashboard is empty because no case records have been created.
          </p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
