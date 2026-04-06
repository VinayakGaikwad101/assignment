export interface Task {
  _id: string;
  caseId: string;
  title: string;
  dueDate: string;
  ownerName: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "Completed";
  createdAt: string;
}

export interface Case {
  _id: string;
  caseTitle: string;
  clientName: string;
  courtName: string;
  caseType: string;
  nextHearingDate: string;
  stage: "Filing" | "Evidence" | "Arguments" | "Order Reserved";
  notes?: string;
  createdAt: string;
}

export interface DashboardData {
  totalCases: number;
  upcomingHearings: number;
  tasks: {
    pending: number;
    completed: number;
    total: number;
  };
}
