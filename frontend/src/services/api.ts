import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const caseService = {
  getAll: (params?: {
    search?: string;
    stage?: string;
    startDate?: string;
    endDate?: string;
  }) => api.get("/cases", { params }),

  getById: (id: string) => api.get(`/cases/${id}`),

  create: (data: any) => api.post("/cases", data),

  update: (id: string, data: any) => api.put(`/cases/${id}`, data),

  delete: (id: string) => api.delete(`/cases/${id}`),
};

export const taskService = {
  getByCase: (caseId: string) => api.get(`/cases/${caseId}/tasks`),

  create: (caseId: string, data: any) =>
    api.post(`/cases/${caseId}/tasks`, data),

  update: (taskId: string, data: any) => api.put(`/tasks/${taskId}`, data),

  toggleStatus: (taskId: string) => api.patch(`/tasks/${taskId}/status`),

  delete: (taskId: string) => api.delete(`/tasks/${taskId}`),
};

export const dashboardService = {
  getSummary: () => api.get("/dashboard/summary"),
};

export default api;
