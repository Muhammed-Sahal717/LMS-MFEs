import { api } from "./client";
import type { DashboardOut } from "./types";

/** Student dashboard aggregate. */
export const dashboardApi = {
  summary: () => api.get<DashboardOut>("/dashboard"),
};
