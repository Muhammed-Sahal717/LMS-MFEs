import { api } from "./client";
import type { DashboardSummary } from "./types";

/** Student dashboard aggregate. */
export const dashboardApi = {
  summary: () => api.get<DashboardSummary>("/dashboard/summary"),
};
